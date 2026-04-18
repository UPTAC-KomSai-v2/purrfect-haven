import pool from '../config/db.js';

// GET /api/users/profile
export async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, first_name, last_name, city, email, cell_num, created_at
       FROM Users WHERE user_id = ?`,
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ user: rows[0] });

  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}