import pool from '../config/db.js';

export const getAllArticles = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        excerpt,
        category,
        source_name,
        source_url,
        image_url,
        is_featured,
        created_at,
        updated_at
      FROM articles
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      status: 'success',
      data: {
        articles: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedArticles = async (req, res, next) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        title,
        excerpt,
        category,
        source_name,
        source_url,
        image_url,
        is_featured,
        created_at,
        updated_at
      FROM articles
      WHERE is_featured = true
      ORDER BY created_at DESC
      LIMIT 3
      `
    );

    return res.status(200).json({
      status: 'success',
      data: {
        articles: result.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};