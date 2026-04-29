import pool from '../config/db.js';

export async function submitRescueReport(req, res) {
  const {
    fullName,
    contactNumber,
    animalType,
    estNum,
    location,
    dateSpotted,
    timeSpotted,
    description,
    privacyConsent,
  } = req.body;

  const userId = req.session.userId || null; // Optional — user may not be logged in

  // Validation
  if (!fullName || !contactNumber || !location || !description) {
    return res.status(400).json({
      error: 'Missing required fields: fullName, contactNumber, location, description',
    });
  }

  if (!privacyConsent) {
    return res.status(400).json({
      error: 'Privacy consent is required to submit a rescue report.',
    });
  }

  try {
    // Construct structured description with all form details
    const structuredDescription = `
**Reporter:** ${fullName}
**Contact:** ${contactNumber}
**Animal Type:** ${animalType || 'Not specified'}
**Estimated Count:** ${estNum || 1}
**Date Spotted:** ${dateSpotted || 'Not specified'}
**Time Spotted:** ${timeSpotted || 'Not specified'}

**Condition & Description:**
${description}
    `.trim();

    // If user_id is null, we need to handle the NOT NULL constraint
    // Either: 1) Create a generic "anonymous" user record, or 2) Modify schema
    // For now, we'll require login or provide a fallback
    if (!userId) {
      return res.status(400).json({
        error: 'Please log in to submit a rescue report.',
      });
    }

    // Insert rescue report into database
    const [result] = await pool.query(
      `INSERT INTO Rescue_Reports (user_id, location, description)
       VALUES (?, ?, ?)`,
      [userId, location, structuredDescription]
    );

    res.status(201).json({
      success: true,
      message: 'Rescue report submitted successfully.',
      reportId: result.insertId,
    });
  } catch (err) {
    console.error('Error submitting rescue report:', err);
    res.status(500).json({ error: 'Failed to submit rescue report.' });
  }
}

export async function getRescueReports(req, res) {
  const filterByUser = req.query.mine === 'true' && req.session.userId;

  try {
    const [reports] = await pool.query(
      filterByUser
        ? 'SELECT * FROM Rescue_Reports WHERE user_id = ? ORDER BY date_reported DESC'
        : 'SELECT * FROM Rescue_Reports ORDER BY date_reported DESC',
      filterByUser ? [req.session.userId] : []
    );

    res.json({ count: reports.length, reports });
  } catch (err) {
    console.error('Error fetching rescue reports:', err);
    res.status(500).json({ error: 'Failed to fetch rescue reports.' });
  }
}

export async function getRescueReportById(req, res) {
  const { id } = req.params;

  try {
    const [reports] = await pool.query(
      'SELECT * FROM Rescue_Reports WHERE report_id = ?',
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Rescue report not found.' });
    }

    res.json(reports[0]);
  } catch (err) {
    console.error('Error fetching rescue report:', err);
    res.status(500).json({ error: 'Failed to fetch rescue report.' });
  }
}
