# purrfect-haven
This is a repository of Group AENS for CMSC 121 Final Project for the SS 2025-2026.

## How to Run
- npm install
- npm run dev

## Add-on docs
- Read DIRECTORIES.md to see how to modularize what's inside the src file
- Read ASSETS.md to see some notes/reminders on assets handling for the web-app

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

## Postman
Sample Postman input for POST/auth/signup
```
{
  "first_name": "Jolyne",
  "last_name":  "Cujoh",
  "city":       "Orlando",
  "email":      "jcujoh@email.com",
  "cell_num":   "09171234567",
  "password":   "securepass123"
}

POST/auth/login
{
  "first_name": "Jolyne",
  "last_name":  "Cujoh",
  "city":       "Orlando",
  "email":      "jcujoh@email.com",
  "cell_num":   "09171234567",
  "password":   "securepass123"
}
```

::: Sample param
```
api/pets

All available pets (no filter):
GET http://localhost:3000/api/pets

Filter by species:
GET http://localhost:3000/api/pets?species=dog

Filter by breed:
GET http://localhost:3000/api/pets?breed=aspin
Filter by age:
GET http://localhost:3000/api/pets?age=2

Filter by location:
GET http://localhost:3000/api/pets?location=tacloban

Combined filters:
GET http://localhost:3000/api/
```

## api/auth
```
Login
{
  "email":    "angela@email.com",
  "password": "securepass123"
}

Profile update (needs login)
{
  "first_name": "Angela",
  "city": "Ormoc City"
}
```

## styles
```
Define global theme in instead of hardcoded styles: src/styles/theme.css
```

## Deliverables checklist

## Pet name convention
For uploading pics in report a rescue/ community pets/ 
- firstname.jpg
- Add images 