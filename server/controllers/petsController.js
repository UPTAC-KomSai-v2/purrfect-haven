import pool from '../config/db.js';

// GET /api/pets
// Optional query params: ?species=dog&breed=aspin&age=2&location=tacloban
// Minimal info for browsing
export async function getPets(req, res) {
  try {
    const { species, breed, age, location } = req.query;

    let query = `
      SELECT
        p.pet_id,
        p.name,
        s.species_name,
        p.breed,
        p.is_adopted,
        MIN(ph.file_path) AS primary_photo
      FROM Pets p
      JOIN Species s ON p.species_id = s.species_id
      LEFT JOIN pet_photos ph ON p.pet_id = ph.pet_id
      WHERE p.is_adopted = 0
    `;

    const params = [];

    if (species) {
      query += ` AND LOWER(s.species_name) = LOWER(?)`;
      params.push(species);
    }

    if (breed) {
      query += ` AND LOWER(p.breed) LIKE LOWER(?)`;
      params.push(`%${breed}%`);
    }

    if (age) {
      const parsedAge = parseInt(age);
      if (!isNaN(parsedAge)) {
        query += ` AND p.age = ?`;
        params.push(parsedAge);
      }
    }

    if (location) {
      query += ` AND LOWER(p.location_held) LIKE LOWER(?)`;
      params.push(`%${location}%`);
    }

    query += ` GROUP BY p.pet_id ORDER BY p.date_posted DESC`;

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      count: rows.length,
      pets:  rows,
    });

  } catch (err) {
    console.error('Get pets error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}


// GET /api/pets/:id
export async function getPetById(req, res) {
  const { id } = req.params;
 
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'Invalid pet ID.' });
  }
 
  try {
    // Fetch core pet details with species
    const [petRows] = await pool.query(
      `SELECT
        p.pet_id,
        p.name,
        s.species_id,
        s.species_name,
        p.breed,
        p.sex,
        p.age,
        p.color,
        p.description,
        p.location_rescued,
        p.date_rescued,
        p.location_held,
        p.date_posted,
        p.is_adopted
       FROM Pets p
       JOIN Species s ON p.species_id = s.species_id
       WHERE p.pet_id = ?`,
      [parsedId]
    );
 
    if (petRows.length === 0) {
      return res.status(404).json({ error: 'Pet not found.' });
    }
 
    // Fetch all photos for this pet
    const [photoRows] = await pool.query(
      `SELECT pet_pic_id, file_path
       FROM pet_photos
       WHERE pet_id = ?
       ORDER BY pet_pic_id ASC`,
      [parsedId]
    );
 
    // Assemble response
    const pet = {
      ...petRows[0],
      photos: photoRows,
    };
 
    return res.status(200).json({ pet });
 
  } catch (err) {
    console.error('Get pet by ID error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}


// GET /api/pets/adopted
export async function getAdoptedPets(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
        p.pet_id,
        p.name,
        s.species_name,
        p.breed,
        p.sex,
        p.age,
        p.color,
        p.location_rescued,
        p.location_held,
        p.date_posted,
        p.is_adopted,
        MIN(ph.file_path) AS primary_photo
       FROM Pets p
       JOIN Species s ON p.species_id = s.species_id
       LEFT JOIN pet_photos ph ON p.pet_id = ph.pet_id
       WHERE p.is_adopted = 1
       GROUP BY p.pet_id
       ORDER BY p.date_posted DESC`
    );
 
    return res.status(200).json({
      count: rows.length,
      pets:  rows,
    });
 
  } catch (err) {
    console.error('Get adopted pets error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
 