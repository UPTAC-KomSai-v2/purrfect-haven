-- Purrfect Haven Database Schema
-- Run order matters: Species and Users must exist before Pets,
-- and Pets + Users must exist before Adoptions, pet_photos, and Rescue_Reports.

CREATE DATABASE IF NOT EXISTS purrfect_haven;
USE purrfect_haven;

-- -----------------------------------------------------
-- Table: Species
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Species (
  species_id   INT         NOT NULL AUTO_INCREMENT,
  species_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (species_id)
);

-- -----------------------------------------------------
-- Table: Users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
  user_id       INT          NOT NULL AUTO_INCREMENT,
  first_name    VARCHAR(50)  NOT NULL,
  last_name     VARCHAR(50)  NOT NULL,
  city          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  cell_num      VARCHAR(15)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

-- -----------------------------------------------------
-- Table: Pets
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Table: pet_photos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pet_photos (
  pet_pic_id INT          NOT NULL AUTO_INCREMENT,
  pet_id     INT          NOT NULL,
  file_path  VARCHAR(255) NOT NULL,
  PRIMARY KEY (pet_pic_id),
  FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: Adoptions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Adoptions (
  adoption_id  INT      NOT NULL AUTO_INCREMENT,
  user_id      INT      NOT NULL,
  pet_id       INT      NOT NULL,
  date_adopted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (adoption_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (pet_id)  REFERENCES Pets(pet_id)
);

-- -----------------------------------------------------
-- Table: Rescue_Reports
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Rescue_Reports (
  report_id     INT          NOT NULL AUTO_INCREMENT,
  user_id       INT          NOT NULL,
  location      VARCHAR(255) NOT NULL,
  date_reported DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  description   TEXT         NOT NULL,
  PRIMARY KEY (report_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);