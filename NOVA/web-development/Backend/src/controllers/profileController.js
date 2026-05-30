import pool from '../config/db.js';

export const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      motherName,
      motherAge,
      childName,
      birthDate,
      gender,
    } = req.body;

    if (!motherName || !motherAge || !childName || !birthDate || !gender) {
      return res.status(400).json({
        status: 'failed',
        message: 'Semua data wajib diisi',
      });
    }

    const existingMother = await pool.query(
      `
      SELECT id
      FROM mothers
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    let mother;

    if (existingMother.rows.length > 0) {
      const motherResult = await pool.query(
        `
        UPDATE mothers
        SET name = $1,
            age = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, name, age
        `,
        [motherName.trim(), Number(motherAge), existingMother.rows[0].id]
      );

      mother = motherResult.rows[0];
    } else {
      const motherResult = await pool.query(
        `
        INSERT INTO mothers (user_id, name, age)
        VALUES ($1, $2, $3)
        RETURNING id, name, age
        `,
        [userId, motherName.trim(), Number(motherAge)]
      );

      mother = motherResult.rows[0];
    }

    const existingChild = await pool.query(
      `
      SELECT id
      FROM children
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    let child;

    if (existingChild.rows.length > 0) {
      const childResult = await pool.query(
        `
        UPDATE children
        SET mother_id = $1,
            name = $2,
            birth_date = $3,
            gender = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, name, birth_date, gender
        `,
        [mother.id, childName.trim(), birthDate, gender, existingChild.rows[0].id]
      );

      child = childResult.rows[0];
    } else {
      const childResult = await pool.query(
        `
        INSERT INTO children (user_id, mother_id, name, birth_date, gender)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, birth_date, gender
        `,
        [userId, mother.id, childName.trim(), birthDate, gender]
      );

      child = childResult.rows[0];
    }

    return res.status(200).json({
      status: 'success',
      message: 'Data berhasil disimpan',
      data: {
        mother,
        child,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const motherResult = await pool.query(
      `
      SELECT id, name, age
      FROM mothers
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    const childResult = await pool.query(
      `
      SELECT id, name, birth_date, gender
      FROM children
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    return res.status(200).json({
      status: 'success',
      data: {
        mother: motherResult.rows[0] || null,
        child: childResult.rows[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};