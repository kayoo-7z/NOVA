const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || 'http://localhost:8000';

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 10000);

export const predictRisk = async (features) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${AI_SERVICE_URL}/predict/risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const err = new Error(`AI service responded with ${response.status}`);
      err.statusCode = 502;
      throw err;
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      const err = new Error('AI service timeout');
      err.statusCode = 502;
      throw err;
    }

    if (!error.statusCode) {
      error.statusCode = 502;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const checkAiHealth = async () => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return 'error';
    const data = await response.json();
    return data.status === 'ok' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
};