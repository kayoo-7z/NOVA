import axios from "axios";
import { EventSource } from "eventsource";

const HF_SPACE_URL = process.env.HF_SPACE_URL;

export const callHFModel = async ({ gender, age, weight, height }) => {
  console.log("[SERVICE] callHFModel start");

  if (!HF_SPACE_URL) {
    throw new Error("HF_SPACE_URL is not defined");
  }

  const base = HF_SPACE_URL.replace(/\/+$/, "");
  console.log("[HF BASE URL]", base);

  const postUrl = `${base}/gradio_api/call/v2/gradio_interface`;

  const mappedGender =
    gender === 1 ? "Male" : gender === 0 ? "Female" : gender;

  const payload = {
    gender: mappedGender,
    age: Number(age),
    weight: Number(weight),
    height: Number(height),
  };

  console.log("[HF POST URL]", postUrl);
  console.log("[HF POST PAYLOAD]", payload);

  let eventId;

  try {
    const response = await axios.post(postUrl, payload, {
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[HF POST STATUS]", response.status);
    console.log("[HF POST HEADERS]", response.headers);
    console.log("[HF POST DATA]", response.data);

    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("text/html")) {
      throw new Error(
        "Hugging Face returned HTML instead of JSON API response. Check HF_SPACE_URL and endpoint."
      );
    }

    eventId = response?.data?.event_id;

    if (!eventId) {
      throw new Error("Hugging Face did not return event_id");
    }
  } catch (err) {
    console.error("[HF POST ERROR]", err.response?.data || err.message);
    throw err;
  }

  const sseUrl = `${base}/gradio_api/call/gradio_interface/${eventId}`;

  console.log("[HF SSE URL]", sseUrl);

  return new Promise((resolve, reject) => {
    let es;

    const timeout = setTimeout(() => {
      try {
        es?.close();
      } catch {}

      reject(new Error("Timeout waiting for Hugging Face SSE response"));
    }, 60000);

    es = new EventSource(sseUrl);

    es.addEventListener("complete", (event) => {
      clearTimeout(timeout);

      try {
        es.close();
      } catch {}

      try {
        console.log("[HF SSE COMPLETE RAW]", event.data);

        const outputs = JSON.parse(event.data);

        if (!Array.isArray(outputs)) {
          throw new Error("SSE complete data is not an array");
        }

        const [output, output_1, output_2] = outputs;

        resolve({
          output,
          output_1,
          output_2,
        });
      } catch (err) {
        reject(err);
      }
    });

    es.onerror = (err) => {
      clearTimeout(timeout);

      try {
        es.close();
      } catch {}

      console.error("[HF SSE ERROR]", err);

      reject(new Error("Failed while listening to Hugging Face SSE"));
    };
  });
};