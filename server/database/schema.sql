CREATE DATABASE IF NOT EXISTS purrfect_haven;
USE purrfect_haven;

-- =====================================================
-- table: species
-- lookup table para sa pet types (Dog, Cat, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS Species (
  species_id   INT         NOT NULL AUTO_INCREMENT,
  species_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (species_id)
);

-- =====================================================
-- table: users
-- bagong column: is_admin para malaman kung admin or regular user
-- =====================================================
CREATE TABLE IF NOT EXISTS Users (
  user_id       INT          NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  city          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  cell_num      VARCHAR(15)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin      TINYINT      NOT NULL DEFAULT 0,  -- 0 = regular, 1 = admin
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

-- =====================================================
-- table: pets
-- pwedeng auto-created ito kapag in-approve ng admin yung community post.
-- =====================================================
CREATE TABLE IF NOT EXISTS Pets (
  pet_id           INT          NOT NULL AUTO_INCREMENT,
  name             VARCHAR(100) NOT NULL,
  species_id       INT          NOT NULL,
  breed            VARCHAR(100),
  sex              VARCHAR(10)  NOT NULL,
  age              INT,
  color            VARCHAR(100),
  description      TEXT,
  location_rescued VARCHAR(255),
  date_rescued     DATETIME,
  location_held    VARCHAR(255) NOT NULL,
  date_posted      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_adopted       TINYINT      NOT NULL DEFAULT 0,
  PRIMARY KEY (pet_id),
  FOREIGN KEY (species_id) REFERENCES Species(species_id)
);

-- =====================================================
-- table: pet_photos
-- multiple photos per pet
-- =====================================================
CREATE TABLE IF NOT EXISTS pet_photos (
  pet_pic_id INT          NOT NULL AUTO_INCREMENT,
  pet_id     INT          NOT NULL,
  file_path  VARCHAR(255) NOT NULL,
  PRIMARY KEY (pet_pic_id),
  FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE
);

-- =====================================================
-- table: adoptions
-- malaking refactor — may status tracking para sa lahat ng phases
-- (0 hanggang 4) at appointment.
--
-- yung application form fields (address, financial info, checkboxes,
-- motivation) nilagay na rin dito instead of separate table — para
-- mas simple, walang masyadong join.
-- =====================================================
CREATE TABLE IF NOT EXISTS Adoptions (
  adoption_id    INT NOT NULL AUTO_INCREMENT,
  user_id        INT NOT NULL,  -- yung nag-apply
  pet_id         INT NOT NULL,

  -- status flow ng adoption:
  --   pending               → bagong submit, hindi pa na-review
  --   appointment_scheduled → may date na para makita yung pet (phase 0)
  --   under_review          → tapos na appointment, nag-de-decide pa admin
  --   approved              → in-approve ng admin (phase 3)
  --   rejected              → in-reject ng admin
  --   completed             → na-claim na, official adopted
  status ENUM(
    'pending',
    'appointment_scheduled',
    'under_review',
    'approved',
    'rejected',
    'completed'
  ) NOT NULL DEFAULT 'pending',

  -- mga details galing sa application form (phase 1)
  applicant_address    VARCHAR(255) NOT NULL,
  is_first_pet         TINYINT      NOT NULL DEFAULT 0,
  has_experience       TINYINT      NOT NULL DEFAULT 0,  -- may experience sa pets?
  has_other_pets       TINYINT      NOT NULL DEFAULT 0,  -- may iba pang pets sa bahay?
  has_children         TINYINT      NOT NULL DEFAULT 0,  -- may bata sa bahay?
  financial_capability TEXT,
  motivation           TEXT,                              -- bakit gusto mag-adopt?
  owns_home            TINYINT      NOT NULL DEFAULT 0,

  -- phase 0: appointment para makita yung pet
  appointment_date DATETIME NULL,

  -- phase 3: decision details
  decision_note TEXT     NULL,  -- reason ng admin (approve o reject)
  date_decided  DATETIME NULL,

  -- timeline tracking
  date_applied   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_completed DATETIME NULL,  -- kapag na-claim na yung pet

  PRIMARY KEY (adoption_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (pet_id)  REFERENCES Pets(pet_id)
);

-- =====================================================
-- table: rescue_reports
-- may status at admin_note para may tracking ng ano na nangyari sa report.
-- =====================================================
CREATE TABLE IF NOT EXISTS Rescue_Reports (
  report_id     INT          NOT NULL AUTO_INCREMENT,
  user_id       INT          NOT NULL,
  location      VARCHAR(255) NOT NULL,
  description   TEXT         NOT NULL,
  status        ENUM('pending', 'in_progress', 'resolved', 'closed')
                NOT NULL DEFAULT 'pending',
  admin_note    TEXT         NULL,
  date_reported DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_resolved DATETIME     NULL,
  PRIMARY KEY (report_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- =====================================================
-- table: rescue_report_photos
-- multiple photos per report
-- =====================================================
CREATE TABLE IF NOT EXISTS rescue_report_photos (
  photo_id  INT          NOT NULL AUTO_INCREMENT,
  report_id INT          NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (report_id) REFERENCES Rescue_Reports(report_id) ON DELETE CASCADE
);

-- =====================================================
-- table: community_posts
-- kapag may user na gusto mag-post ng pet for adoption.
-- hindi agad lalabas sa public — kailangan muna i-approve ng admin.
-- pag in-approve, gagawa siya ng Pet record at ila-link via created_pet_id.
-- =====================================================
CREATE TABLE IF NOT EXISTS Community_Posts (
  post_id     INT NOT NULL AUTO_INCREMENT,
  user_id     INT NOT NULL,  -- yung nag-post

  -- details ng pet na ipa-post
  pet_name    VARCHAR(100) NOT NULL,
  species_id  INT          NOT NULL,
  breed       VARCHAR(100),
  sex         VARCHAR(10)  NOT NULL,
  age         INT,
  color       VARCHAR(100),
  description TEXT,
  location    VARCHAR(255) NOT NULL,

  -- moderation by admin
  status         ENUM('pending', 'approved', 'rejected')
                 NOT NULL DEFAULT 'pending',
  admin_note     TEXT NULL,
  created_pet_id INT  NULL,  -- pag in-approve, ito yung Pet record na nagawa

  date_posted   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_reviewed DATETIME NULL,

  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id)        REFERENCES Users(user_id),
  FOREIGN KEY (species_id)     REFERENCES Species(species_id),
  FOREIGN KEY (created_pet_id) REFERENCES Pets(pet_id) ON DELETE SET NULL
);

-- =====================================================
-- table: community_post_photos
-- =====================================================
CREATE TABLE IF NOT EXISTS community_post_photos (
  photo_id  INT          NOT NULL AUTO_INCREMENT,
  post_id   INT          NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (post_id) REFERENCES Community_Posts(post_id) ON DELETE CASCADE
);

-- =====================================================
-- table: welfare_checks
-- phase 4a — admin checks how the adopted pet is doing.
-- =====================================================
CREATE TABLE IF NOT EXISTS Welfare_Checks (
  check_id         INT NOT NULL AUTO_INCREMENT,
  adoption_id      INT NOT NULL,
  admin_id         INT NOT NULL,  -- sinong admin nag-conduct ng check
  condition_status ENUM('excellent', 'good', 'concerning', 'critical')
                   NOT NULL,
  notes            TEXT     NOT NULL,
  check_date       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (check_id),
  FOREIGN KEY (adoption_id) REFERENCES Adoptions(adoption_id),
  FOREIGN KEY (admin_id)    REFERENCES Users(user_id)
);

-- =====================================================
-- table: post_adoption_updates
-- phase 4b — adoptive parent shares update tungkol sa pet.
-- =====================================================
CREATE TABLE IF NOT EXISTS Post_Adoption_Updates (
  update_id   INT      NOT NULL AUTO_INCREMENT,
  adoption_id INT      NOT NULL,
  update_text TEXT     NOT NULL,
  date_posted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (update_id),
  FOREIGN KEY (adoption_id) REFERENCES Adoptions(adoption_id) ON DELETE CASCADE
);

-- =====================================================
-- table: post_adoption_update_photos
-- =====================================================
CREATE TABLE IF NOT EXISTS post_adoption_update_photos (
  photo_id  INT          NOT NULL AUTO_INCREMENT,
  update_id INT          NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (update_id) REFERENCES Post_Adoption_Updates(update_id) ON DELETE CASCADE
);

-- =====================================================
-- table: stories
-- optional feature — adoptive parent shares full story,
-- admin reviews and publishes.  may flag para sa published vs draft.
-- =====================================================
CREATE TABLE IF NOT EXISTS Stories (
  story_id     INT          NOT NULL AUTO_INCREMENT,
  user_id      INT          NOT NULL,
  pet_id       INT          NOT NULL,
  adoption_id  INT          NULL,   -- optional link sa specific adoption record
  title        VARCHAR(255) NOT NULL,
  content      TEXT         NOT NULL,
  is_published TINYINT      NOT NULL DEFAULT 0,
  submitted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME     NULL,
  PRIMARY KEY (story_id),
  FOREIGN KEY (user_id)     REFERENCES Users(user_id),
  FOREIGN KEY (pet_id)      REFERENCES Pets(pet_id),
  FOREIGN KEY (adoption_id) REFERENCES Adoptions(adoption_id) ON DELETE SET NULL
);

-- =====================================================
-- table: story_photos
-- =====================================================
CREATE TABLE IF NOT EXISTS story_photos (
  photo_id  INT          NOT NULL AUTO_INCREMENT,
  story_id  INT          NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (story_id) REFERENCES Stories(story_id) ON DELETE CASCADE
);