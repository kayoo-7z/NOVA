import pool from "../config/db.js";
import { callHFModel } from "../services/huggingFaceSpaceService.js";

const HISTORY_LIMIT = 20;

const normalizeGenderForAI = (gender) => {
  if (gender === "Laki-laki") return "Male";
  if (gender === "Perempuan") return "Female";
  if (gender === "Male") return "Male";
  if (gender === "Female") return "Female";
  if (gender === 1) return "Male";
  if (gender === 0) return "Female";

  return gender;
};

const isEmptyValue = (value) => {
  return value === undefined || value === null || value === "";
};

const generateAiResponseText = ({
  childName,
  riskCategory,
  confidence,
  bmi,
}) => {
  const category = String(riskCategory || "").toLowerCase();

  if (category.includes("sangat tinggi")) {
    return `Hasil analisis menunjukkan bahwa ${childName} berada pada kategori ${riskCategory} dengan tingkat keyakinan ${confidence}. Nilai BMI yang dihitung adalah ${bmi}. Kondisi ini perlu mendapatkan perhatian lebih. Disarankan untuk segera melakukan konsultasi ke posyandu, puskesmas, atau tenaga kesehatan agar pertumbuhan anak dapat diperiksa lebih lanjut.`;
  }

  if (category.includes("tinggi")) {
    return `Hasil analisis menunjukkan bahwa ${childName} berada pada kategori ${riskCategory} dengan tingkat keyakinan ${confidence}. Nilai BMI yang dihitung adalah ${bmi}. Pemantauan tumbuh kembang perlu dilakukan secara rutin, terutama pada tinggi badan, berat badan, dan asupan gizi harian.`;
  }

  if (category.includes("sedang")) {
    return `Hasil analisis menunjukkan bahwa ${childName} berada pada kategori ${riskCategory} dengan tingkat keyakinan ${confidence}. Nilai BMI yang dihitung adalah ${bmi}. Anak masih perlu dipantau secara berkala. Pastikan asupan gizi seimbang, protein hewani, dan pemeriksaan rutin tetap dilakukan.`;
  }

  return `Hasil analisis menunjukkan bahwa ${childName} berada pada kategori ${
    riskCategory || "Risiko Rendah"
  } dengan tingkat keyakinan ${confidence}. Nilai BMI yang dihitung adalah ${bmi}. Tetap jaga pola makan bergizi, imunisasi, serta pemantauan pertumbuhan secara rutin.`;
};

const deleteOldPredictionHistory = async (userId) => {
  await pool.query(
    `
    DELETE FROM stunting_analyses
    WHERE id IN (
      SELECT id
      FROM stunting_analyses
      WHERE user_id = $1
      ORDER BY created_at DESC, id DESC
      OFFSET $2
    )
    `,
    [userId, HISTORY_LIMIT]
  );
};

export const predict = async (req, res, next) => {
  console.log("[CONTROLLER] predict invoked");

  try {
    const userId = req.user.id;

    const {
      child_name,
      name,
      gender,
      age_month,
      age,
      weight_kg,
      weight,
      height_cm,
      height,
    } = req.body;

    const finalChildName = child_name || name;
    const finalAge = age_month ?? age;
    const finalWeight = weight_kg ?? weight;
    const finalHeight = height_cm ?? height;

    if (
      isEmptyValue(finalChildName) ||
      isEmptyValue(gender) ||
      isEmptyValue(finalAge) ||
      isEmptyValue(finalWeight) ||
      isEmptyValue(finalHeight)
    ) {
      return res.status(400).json({
        success: false,
        status: "failed",
        message:
          "child_name/name, gender, age_month/age, weight_kg/weight, dan height_cm/height wajib diisi.",
      });
    }

    const numericAge = Number(finalAge);
    const numericWeight = Number(finalWeight);
    const numericHeight = Number(finalHeight);

    if (
      Number.isNaN(numericAge) ||
      Number.isNaN(numericWeight) ||
      Number.isNaN(numericHeight)
    ) {
      return res.status(400).json({
        success: false,
        status: "failed",
        message: "age, weight, dan height harus berupa angka.",
      });
    }

    const normalizedGender = normalizeGenderForAI(gender);

    console.log("[CONTROLLER] calling HF model with:", {
      gender: normalizedGender,
      age: numericAge,
      weight: numericWeight,
      height: numericHeight,
    });

    const hfResult = await callHFModel({
      gender: normalizedGender,
      age: numericAge,
      weight: numericWeight,
      height: numericHeight,
    });

    console.log("[CONTROLLER] HF result", hfResult);

    if (!hfResult || typeof hfResult !== "object") {
      throw new Error("Unexpected HF response format");
    }

    const riskCategory = hfResult.output;
    const confidence = hfResult.output_1;
    const bmi = Number(hfResult.output_2).toFixed(2);

    const aiResponse = generateAiResponseText({
      childName: finalChildName,
      riskCategory,
      confidence,
      bmi,
    });

    const result = await pool.query(
      `
      INSERT INTO stunting_analyses (
        user_id,
        child_name,
        gender,
        age_month,
        weight_kg,
        height_cm,
        bmi,
        risk_category,
        confidence,
        ai_response,
        raw_ai_result
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        userId,
        finalChildName,
        gender,
        numericAge,
        numericWeight,
        numericHeight,
        Number(bmi),
        riskCategory,
        confidence,
        aiResponse,
        hfResult,
      ]
    );

    await deleteOldPredictionHistory(userId);

    return res.status(201).json({
      success: true,
      status: "success",
      message: "Analisis stunting berhasil dibuat dengan model AI.",
      data: result.rows[0],
      prediction: {
        risk_category: riskCategory,
        confidence,
        bmi,
        ai_response: aiResponse,
      },
      raw: hfResult,
    });
  } catch (err) {
    console.error("[CONTROLLER] error", err.response?.data || err.message);

    if (next) {
      return next(err);
    }

    return res.status(500).json({
      success: false,
      status: "failed",
      message: err.message || "Prediction failed",
    });
  }
};

export const getPredictionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        child_name,
        gender,
        age_month,
        weight_kg,
        height_cm,
        bmi,
        risk_category,
        confidence,
        ai_response,
        raw_ai_result,
        created_at,
        updated_at
      FROM stunting_analyses
      WHERE user_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2
      `,
      [userId, HISTORY_LIMIT]
    );

    return res.status(200).json({
      success: true,
      status: "success",
      message: "Riwayat prediksi berhasil diambil.",
      data: result.rows,
    });
  } catch (err) {
    console.error("[GET PREDICTION HISTORY ERROR]", err.message);

    if (next) {
      return next(err);
    }

    return res.status(500).json({
      success: false,
      status: "failed",
      message: err.message || "Gagal mengambil riwayat prediksi.",
    });
  }
};