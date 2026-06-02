import pool from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import InvariantError from '../exceptions/InvariantError.js';
import { handleControllerError } from '../utils/controllerError.js';
import {
  validateCreateChild,
  validateUpdateChild,
  validateMeasurement,
  validateAssess,
} from '../validators/childValidator.js';
import {
  mapChild,
  mapMeasurement,
  mapAssessment,
  buildFeaturesForAi,
} from '../utils/childHelpers.js';
import { predictRisk } from '../services/aiService.js';

const getChildForUser = async (childId, userId) => {
  const result = await pool.query(
    'SELECT * FROM children WHERE id = $1 AND user_id = $2',
    [childId, userId],
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Anak tidak ditemukan');
  }
  return result.rows[0];
};

export const listChildren = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM children WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id],
    );
    return res.status(200).json({
      status: 'success',
      message: 'Daftar anak berhasil diambil',
      data: { children: result.rows.map(mapChild) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const createChild = async (req, res) => {
  try {
    validateCreateChild(req.body);
    const { name, dateOfBirth, gender } = req.body;
    const result = await pool.query(
      `INSERT INTO children (user_id, name, date_of_birth, gender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, name.trim(), dateOfBirth, gender],
    );
    return res.status(201).json({
      status: 'success',
      message: 'Profil anak berhasil ditambahkan',
      data: { child: mapChild(result.rows[0]) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const getChild = async (req, res) => {
  try {
    const child = await getChildForUser(req.params.childId, req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Profil anak berhasil diambil',
      data: { child: mapChild(child) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const updateChild = async (req, res) => {
  try {
    validateUpdateChild(req.body);
    await getChildForUser(req.params.childId, req.user.id);

    const fields = [];
    const values = [];
    let i = 1;

    if (req.body.name !== undefined) {
      fields.push(`name = $${i++}`);
      values.push(req.body.name.trim());
    }
    if (req.body.dateOfBirth !== undefined) {
      fields.push(`date_of_birth = $${i++}`);
      values.push(req.body.dateOfBirth);
    }
    if (req.body.gender !== undefined) {
      fields.push(`gender = $${i++}`);
      values.push(req.body.gender);
    }

    values.push(req.params.childId, req.user.id);
    const result = await pool.query(
      `UPDATE children SET ${fields.join(', ')}
       WHERE id = $${i++} AND user_id = $${i}
       RETURNING *`,
      values,
    );

    return res.status(200).json({
      status: 'success',
      message: 'Profil anak berhasil diperbarui',
      data: { child: mapChild(result.rows[0]) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const deleteChild = async (req, res) => {
  try {
    await getChildForUser(req.params.childId, req.user.id);
    await pool.query('DELETE FROM children WHERE id = $1 AND user_id = $2', [
      req.params.childId,
      req.user.id,
    ]);
    return res.status(200).json({
      status: 'success',
      message: 'Profil anak berhasil dihapus',
      data: {},
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const addMeasurement = async (req, res) => {
  try {
    validateMeasurement(req.body);
    await getChildForUser(req.params.childId, req.user.id);
    const { heightCm, weightKg, measuredOn } = req.body;

    const result = await pool.query(
      `INSERT INTO growth_records (child_id, height_cm, weight_kg, measured_on, source)
       VALUES ($1, $2, $3, $4, 'manual')
       RETURNING *`,
      [req.params.childId, heightCm, weightKg, measuredOn],
    );

    return res.status(201).json({
      status: 'success',
      message: 'Data pengukuran berhasil disimpan',
      data: { measurement: mapMeasurement(result.rows[0]) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const listMeasurements = async (req, res) => {
  try {
    await getChildForUser(req.params.childId, req.user.id);
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const result = await pool.query(
      `SELECT * FROM growth_records
       WHERE child_id = $1
       ORDER BY measured_on DESC, created_at DESC
       LIMIT $2`,
      [req.params.childId, limit],
    );

    return res.status(200).json({
      status: 'success',
      message: 'Riwayat pengukuran berhasil diambil',
      data: { measurements: result.rows.map(mapMeasurement) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

const getMeasurementForChild = async (childId, measurementId) => {
  const result = await pool.query(
    `SELECT * FROM growth_records
     WHERE id = $1 AND child_id = $2`,
    [measurementId, childId],
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('Data pengukuran tidak ditemukan');
  }
  return result.rows[0];
};

const getLatestMeasurement = async (childId) => {
  const result = await pool.query(
    `SELECT * FROM growth_records
     WHERE child_id = $1
     ORDER BY measured_on DESC, created_at DESC
     LIMIT 1`,
    [childId],
  );
  if (result.rows.length === 0) {
    throw new InvariantError('Belum ada data pengukuran untuk anak ini');
  }
  return result.rows[0];
};

export const assessRisk = async (req, res) => {
  try {
    validateAssess(req.body);
    const child = await getChildForUser(req.params.childId, req.user.id);

    const measurement = req.body.measurementId
      ? await getMeasurementForChild(child.id, req.body.measurementId)
      : await getLatestMeasurement(child.id);

    const features = buildFeaturesForAi(child, measurement);

    let prediction;
    try {
      prediction = await predictRisk(features);
    } catch (aiErr) {
      console.error('AI SERVICE ERROR:', aiErr.message);
      return res.status(502).json({
        status: 'failed',
        message: 'Layanan prediksi AI tidak tersedia. Coba lagi nanti.',
      });
    }

    const insert = await pool.query(
      `INSERT INTO risk_assessments
        (child_id, growth_record_id, risk_category, probabilities, model_version)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        child.id,
        measurement.id,
        prediction.riskCategory,
        prediction.probabilities,
        prediction.modelVersion,
      ],
    );

    return res.status(200).json({
      status: 'success',
      message: 'Penilaian risiko berhasil',
      data: { assessment: mapAssessment(insert.rows[0]) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const listRiskHistory = async (req, res) => {
  try {
    await getChildForUser(req.params.childId, req.user.id);
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const result = await pool.query(
      `SELECT * FROM risk_assessments
       WHERE child_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [req.params.childId, limit],
    );

    return res.status(200).json({
      status: 'success',
      message: 'Riwayat penilaian risiko berhasil diambil',
      data: { assessments: result.rows.map(mapAssessment) },
    });
  } catch (err) {
    return handleControllerError(err, res);
  }
};