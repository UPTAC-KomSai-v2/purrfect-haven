import pool from '../config/db.js';

export async function createCommunityPost(req, res) {
  const {
    petName,
    age,
    weight,
    gender,
    type,
    breed,
    color,
    personality,
    organization,
    location,
    health,
    about,
  } = req.body;

  const userId = req.session.userId || null;

  // Validation
  if (!petName || !type || !gender || !location) {
    return res.status(400).json({
      error: 'Missing required fields: petName, type, gender, location',
    });
  }

  if (!userId) {
    return res.status(401).json({
      error: 'Please log in to submit a community adoption post.',
    });
  }

  try {
    // 1. Get species_id using species_name from your Species table
    const [speciesRows] = await pool.query(
      'SELECT species_id FROM Species WHERE LOWER(species_name) = LOWER(?) LIMIT 1',
      [type]
    );

    if (speciesRows.length === 0) {
      return res.status(400).json({
        error: `Unknown species type: ${type}`,
      });
    }

    const speciesId = speciesRows[0].species_id;

    // 2. Format description (merging optional UI fields)
    const fullDescription = `
${about || ''}

Weight: ${weight || 'N/A'} kg
Personality: ${personality || 'N/A'}
Health: ${health || 'N/A'}
Organization/Foster: ${organization || 'N/A'}
    `.trim();

    // 3. Insert into Community_Posts (Matches your CREATE TABLE schema)
    const [result] = await pool.query(
      `INSERT INTO Community_Posts 
      (user_id, pet_name, species_id, breed, sex, age, color, description, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        petName,
        speciesId,
        breed || null,
        gender, // This maps to the 'sex' column
        age || null,
        color || null,
        fullDescription,
        location,
      ]
    );

    // This 'postId' is what the frontend navigate() uses
    const postId = result.insertId;

    res.status(201).json({
      success: true,
      message: 'Community post submitted and pending approval.',
      postId, 
    });

  } catch (err) {
    console.error('Error creating community post:', err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
}

// GET ALL APPROVED POSTS
export async function getCommunityPosts(req, res) {
  try {
    const [posts] = await pool.query(
      `SELECT cp.*, s.species_name
       FROM Community_Posts cp
       JOIN Species s ON cp.species_id = s.species_id
       WHERE cp.status = 'approved'
       ORDER BY cp.date_posted DESC`
    );
    res.json({ count: posts.length, posts });
  } catch (err) {
    console.error('Error fetching community posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
}

// GET SINGLE POST BY ID
export async function getCommunityPostById(req, res) {
  // Using 'id' because your route is likely /:id
  const { id } = req.params; 
  
  try {
    const [posts] = await pool.query(
      `SELECT cp.*, s.species_name
       FROM Community_Posts cp
       JOIN Species s ON cp.species_id = s.species_id
       WHERE cp.post_id = ?`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json(posts[0]);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
}