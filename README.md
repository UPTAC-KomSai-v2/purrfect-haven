# purrfect-haven
This is a repository of Group AENS for CMSC 121 Final Project for the SS 2025-2026.

## How to Run
- npm install
- npm run dev

## From Vite docs
- index.html as entry point for the application

## Add-on docs
- Read DIRECTORIES.md to see how to modularize what's inside the src file
- Read ASSETS.md to see some notes/reminders on assets handling for the web-app

## List
- Top navbar
- Hero section
- Brown buttons
- FeaturedStory section

## DB migrate cmd
- See server/package.json
- npm run migrate

### Sample migration
```
npm run migrate
> server@1.0.0 migrate
> node database/migrate.js

◇ injected env (6) from .env // tip: ⌘ enable debugging { debug: true }
Connecting to MySQL...
Connected. Running schema migration...

Migration complete. Tables created:
  - Species
  - Users
  - Pets
  - pet_photos
  - Adoptions
  - Rescue_Reports

Database is ready.
aus.sn50@Angelas-MacBook-Air server % 
```