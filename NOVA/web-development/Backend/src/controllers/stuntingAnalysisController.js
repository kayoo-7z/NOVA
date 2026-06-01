import pool from "../config/db.js";

const calculateBmi = (weightKg, heightCm) => {
  const heightMeter = Number(heightCm) / 100;

  if (!heightMeter || heightMeter <= 0) {
    return null;
  }

  return Number((Number(weightKg) / (heightMeter * heightMeter)).toFixed(2));
};

const generateDummyAnalysis = ({ age_month, weight_kg, height_cm }) => {
  const age = Number(age_month);
  const weight = Number(weight_kg);
  const height = Number(height_cm);
  const bmi = calculateBmi(weight, height);

  let risk_category = "Risiko Rendah";
  let confidence = "82.45%";
  let ai_response =
    "Berdasarkan data yang dimasukkan, kondisi pertumbuhan anak masih dapat terus dipantau secara berkala. Tetap jaga asupan gizi seimbang, protein hewani, imunisasi, dan pemeriksaan rutin ke posyandu atau fasilitas kesehatan.";

  if (age <= 24 && (height < 75 || weight < 8)) {
    risk_category = "Risiko Sangat Tinggi";
    confidence = "97.18%";
    ai_response =
      "Berdasarkan indikator usia, tinggi badan, dan berat badan yang dimasukkan, anak memiliki risiko stunting yang perlu diperhatikan. Disarankan untuk segera melakukan konsultasi ke posyandu, puskesmas, atau tenaga kesehatan agar mendapatkan pemeriksaan lebih lanjut.";
  } else if (height < 85 || weight < 10) {
    risk_category = "Risiko Sedang";
    confidence = "88.63%";
    ai_response =
      "Hasil analisis menunjukkan adanya beberapa indikator pertumbuhan yang perlu dipantau. Pastikan anak mendapatkan makanan bergizi seimbang, terutama protein hewani, serta lakukan pemantauan tinggi dan berat badan secara rutin.";
  }

  return {
    bmi,
    risk_category,
    confidence,
    ai_response,
    raw_ai_result: {
      source: "dummy-analysis",
      note: "Hasil ini masih dummy sebelum integrasi model AI Hugging Face.",
      input: {
        age_month: age,
        weight_kg: weight,
        height_cm: height,
      },
      output: {
        bmi,
        risk_category,
        confidence,
        ai_response,
      },
    },
  };
};

export const createStuntingAnalysis = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { child_name, gender, age_month, weight_kg, height_cm } = req.body;

    if (!child_name || !gender || !age_month || !weight_kg || !height_cm) {
      return res.status(400).json({
        status: "failed",
        message:
          "child_name, gender, age_month, weight_kg, dan height_cm wajib diisi.",
      });
    }

    const analysis = generateDummyAnalysis({
      age_month,
      weight_kg,
      height_cm,
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
        child_name,
        gender,
        Number(age_month),
        Number(weight_kg),
        Number(height_cm),
        analysis.bmi,
        analysis.risk_category,
        analysis.confidence,
        analysis.ai_response,
        analysis.raw_ai_result,
      ]
    );

    return res.status(201).json({
      status: "success",
      message: "Analisis stunting berhasil dibuat.",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getStuntingAnalyses = async (req, res, next) => {
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
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      status: "success",
      message: "Riwayat analisis berhasil diambil.",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};