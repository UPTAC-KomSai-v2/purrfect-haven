import pool from '../config/db.js';

export async function createCommunityPost(req, res) {
  const {
    petName, age, weight, gender, type, breed, color,
    personality, organization, location, health, about,
  } = req.body;

  const userId = req.session.userId || null;

  if (!petName || !type || !gender || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Please log in first.' });
  }

  try {
    const [speciesRows] = await pool.query(
      'SELECT species_id FROM Species WHERE LOWER(species_name) = LOWER(?) LIMIT 1',
      [type]
    );

    if (speciesRows.length === 0) {
      return res.status(400).json({ error: `Unknown species type: ${type}` });
    }

    const speciesId = speciesRows[0].species_id;

    // FIX: Removed the 'fullDescription' string builder. 
    // We now pass raw values to specific columns and only the 'about' text to 'description'.
    const [result] = await pool.query(
      `INSERT INTO Community_Posts 
      (user_id, pet_name, species_id, breed, sex, age, color, personality, organization, health, location, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        petName, 
        speciesId, 
        breed || null, 
        gender, 
        age || null, 
        color || null, 
        personality || null, 
        organization || null, 
        health || null, 
        location,
        about || null  
      ]
    );

    res.status(201).json({ success: true, message: 'Submitted', postId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getCommunityPosts(req, res) {
  try {
    const [posts] = await pool.query(
      `SELECT 
        cp.*, 
        s.species_name, 
        u.first_name, u.last_name, u.email, u.cell_num, u.city as user_address
       FROM Community_Posts cp
       JOIN Species s ON cp.species_id = s.species_id
       LEFT JOIN Users u ON cp.user_id = u.user_id
       ORDER BY cp.date_posted DESC`
    );

    const formattedPosts = posts.map(post => ({
      ...post,
      date_posted: new Date(post.date_posted).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      poster: {
        full_name: `${post.first_name} ${post.last_name}`,
        email: post.email,
        cell_num: post.cell_num,
        address: post.user_address
      },
      photos: post.photos ? JSON.parse(post.photos) : []
    }));

    res.json({ count: formattedPosts.length, posts: formattedPosts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
}

export async function getCommunityPostById(req, res) {
  const { id } = req.params;
  try {
    const [posts] = await pool.query('SELECT * FROM Community_Posts WHERE post_id = ?', [id]);
    if (posts.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(posts[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error' });
  }
}