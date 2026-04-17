-- Purrfect Haven Seed Data
-- Run after migrate.js. Safe to re-run (INSERT IGNORE skips duplicates).

USE purrfect_haven;

-- -----------------------------------------------------
-- Seed: Species
-- -----------------------------------------------------
INSERT IGNORE INTO Species (species_name) VALUES
  ('Dog'),
  ('Cat'),
  ('Rabbit'),
  ('Bird'),
  ('Guinea Pig');

-- -----------------------------------------------------
-- Seed: Pets
-- -----------------------------------------------------
INSERT IGNORE INTO Pets (
  pet_id,
  name,
  species_id,
  breed,
  sex,
  age,
  color,
  description,
  location_rescued,
  date_rescued,
  location_held,
  date_posted,
  is_adopted
) VALUES
  (
    1,
    'Chico',
    1,
    'Aspin',
    'Male',
    2,
    'Brown and white',
    'Chico was found wandering near a wet market in poor condition. He is now healthy, vaccinated, and very friendly with people.',
    'Tacloban Public Market, Tacloban City',
    '2025-10-15 09:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-10-20 10:00:00',
    0
  ),
  (
    2,
    'Luna',
    1,
    'Aspin',
    'Female',
    1,
    'Black',
    'Luna was rescued from a flooded area during a storm. She is shy at first but warms up quickly. Good with other dogs.',
    'Marasbaras, Tacloban City',
    '2025-11-02 14:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-11-05 09:00:00',
    0
  ),
  (
    3,
    'Mochi',
    2,
    'Puspin',
    'Female',
    3,
    'Orange tabby',
    'Mochi was surrendered by her previous owner who could no longer care for her. She is calm, litter-trained, and loves to be held.',
    'Ormoc City',
    '2025-09-18 11:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-09-22 08:00:00',
    0
  ),
  (
    4,
    'Koko',
    2,
    'Puspin',
    'Male',
    NULL,
    'Gray and white',
    'Koko was found as a stray kitten. Age is unknown but estimated to be around 1 year old. Playful and energetic.',
    'Palo, Leyte',
    '2025-11-10 16:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-11-12 10:00:00',
    0
  ),
  (
    5,
    'Cottonball',
    3,
    'Philippine White',
    'Female',
    2,
    'White',
    'Cottonball was abandoned in a box near a school. She is gentle, well-behaved, and ideal for families with children.',
    'Candahug, Palo, Leyte',
    '2025-10-01 08:30:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-10-05 09:00:00',
    0
  ),
  (
    6,
    'Bantay',
    1,
    'Aspin',
    'Male',
    4,
    'Golden brown',
    'Bantay was rescued from an abusive household. He is now recovering well and responding positively to training. Needs a patient owner.',
    'Abucay, Tacloban City',
    '2025-08-22 13:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-09-01 09:00:00',
    1
  ),
  (
    7,
    'Nala',
    2,
    'Puspin',
    'Female',
    2,
    'Calico',
    'Nala was found pregnant and gave birth at the shelter. Her kittens have been rehomed and she is now ready for adoption.',
    'Downtown Tacloban City',
    '2025-07-14 10:00:00',
    'Purrfect Haven Shelter, Tacloban City',
    '2025-08-01 09:00:00',
    1
  );