# Purrfect Haven

---

## Quick Start

Run these in order:

- `git clone <repo-url>` — clone the repo
- `cd purrfect-haven/server && npm install` — install backend deps
- `cd ../app && npm install` — install frontend deps
- Create `server/.env` (see [Environment Setup](#environment-setup))
- `cd ../server && npm run migrate` — create the tables
- `npm run seed` — insert sample pets/species
- `npm run dev` — start backend on `http://localhost:3000`
- In a new terminal: `cd app && npm run dev` — start frontend on `http://localhost:5173`

## Becoming an Admin

After signing up through the UI:

- Open MySQL CLI or Workbench
- Run:
  ```sql
  USE purrfect_haven;
  UPDATE Users SET is_admin = 1 WHERE email = 'your@email.com';
  ```
- Log out and back in (the `is_admin` flag loads on login)
- You should now see "Admin" in the navbar

## Database Schema (v2)

### Core tables

- **`Species`** — lookup table (Dog, Cat, etc.)
- **`Users`** — accounts with `is_admin` flag (0 or 1)
- **`Pets`** — adoptable pets, has `is_adopted` flag
- **`pet_photos`** — multiple photos per pet

### Adoption flow tables

- **`Adoptions`** — full application + status timeline
  - Status enum: `pending` → `appointment_scheduled` → `under_review` → `approved` → `completed`
  - Or: any earlier state → `rejected`
- **`Welfare_Checks`** — Phase 4a, admin's post-adoption reports
- **`Post_Adoption_Updates`** — Phase 4b, adopter's pet updates
- **`Stories`** — optional adoption stories with `is_published` flag

### Community + rescue tables

- **`Rescue_Reports`** — reports of strays/injured animals needing rescue
  - Status enum: `pending` → `in_progress` → `resolved` / `closed`
- **`rescue_report_photos`** — photos per rescue report
- **`Community_Posts`** — user posts wanting to rehome a pet
  - When approved by admin, auto-creates a `Pets` row via `created_pet_id`
- **`community_post_photos`** — photos per community post

### Re-running the schema

Important: `CREATE TABLE IF NOT EXISTS` won't update existing tables. To apply schema changes:

- Drop and remigrate (loses data):
  ```bash
  mysql -u root -p -e "DROP DATABASE purrfect_haven;"
  cd server
  npm run migrate
  npm run seed
  ```
- Or write an `ALTER TABLE` patch in MySQL directly (preserves data, recommended mid-development)

---

## API Endpoints

All endpoints prefixed with `/api`. Auth is **session-based** (cookie `connect.sid`).

### Auth — `/api/auth`

- `POST /signup` — create account, returns user
- `POST /login` — log in, sets session cookie, returns user with `is_admin`
- `POST /logout` — destroys session

### Users — `/api/users` (auth required)

- `GET /profile` — current user's profile
- `PUT /profile` — update profile fields (only sends changed fields)

### Pets — `/api/pets` (public)

- `GET /` — list available pets
  - Optional filters: `species`, `breed`, `age`, `location`
- `GET /adopted` — list already-adopted pets
- `GET /:id` — single pet with photos

### Adoptions — `/api/adoptions`

- `POST /` — submit application (auth required)
- `GET /me` — current user's applications (auth required)
- `GET /` — all applications with applicant info (admin only)
- `PUT /:id/status` — update status (admin only)
  - Validates transitions — can't go `rejected` → `approved`
  - When status hits `completed`, auto-flips Pet's `is_adopted` to 1

### Health

- `GET /api/health` — DB ping, returns 200 if reachable

---

## Adoption Status Flow

How an application moves through the system:

- **`pending`** — just submitted, awaiting admin review
- **`appointment_scheduled`** — admin set a date for applicant to meet the pet
- **`under_review`** — appointment done, admin is deciding
- **`approved`** — admin said yes
- **`rejected`** — admin said no (final state)
- **`completed`** — pet has been claimed, adoption is official (final state)

### Allowed transitions

- `pending` → any of: `appointment_scheduled`, `under_review`, `approved`, `rejected`
- `appointment_scheduled` → any of: `under_review`, `approved`, `rejected`
- `under_review` → `approved` or `rejected`
- `approved` → `completed` or `rejected` (rejected allowed for "undo")
- `rejected` → nowhere (final)
- `completed` → nowhere (final)

---

## Sample Postman Payloads

### Sign up

```json
POST /api/auth/signup
{
  "first_name": "Jolyne",
  "last_name":  "Cujoh",
  "city":       "Orlando",
  "email":      "jcujoh@email.com",
  "cell_num":   "09171234567",
  "password":   "securepass123"
}
```

### Log in

```json
POST /api/auth/login
{
  "email":    "jcujoh@email.com",
  "password": "securepass123"
}
```

### Submit adoption

```json
POST /api/adoptions
{
  "pet_id": 1,
  "applicant_address": "Downtown Tacloban",
  "is_first_pet": true,
  "has_experience": false,
  "has_other_pets": false,
  "has_children": false,
  "owns_home": true,
  "financial_capability": "Stable income",
  "motivation": "I love cats."
}
```

### Approve an adoption (admin)

```json
PUT /api/adoptions/5/status
{
  "status": "approved",
  "decision_note": "Welcome to the family!"
}
```

### Schedule appointment (admin)

```json
PUT /api/adoptions/5/status
{
  "status": "appointment_scheduled",
  "appointment_date": "2026-04-15 14:00:00"
}
```

### Filter pets

- `GET /api/pets?species=dog`
- `GET /api/pets?breed=aspin`
- `GET /api/pets?location=tacloban`
- `GET /api/pets?species=cat&age=2`

---

## Implementation Status

### Done

- User signup, login, logout, profile management
- Pet listing with filters
- Pet detail view with photos
- Adoption application submission (Phase 1)
- Admin role + middleware (`requireAdmin`)
- Admin route protection on frontend (`AdminRoute`)
- Admin dashboard fetching real adoption data
- Collapsible cards, status filters, badges
- Approve/reject with decision note (Phase 3)
- Status transition validation
- Adopter profile dashboard with status badges (Phase 2 view)

### Partially done

- Community posts — frontend mockup exists, no backend yet
- Rescue reports — frontend form exists, no backend yet
- Pet creation/upload — multer installed, no endpoint or UI

### Not started

- Phase 0 — appointment scheduling UI (endpoint supports it, no admin button yet)
- Phase 4a — welfare checks
- Phase 4b — post-adoption updates
- Stories feature
- Email notifications (UI says it does, nothing actually sends)
- Edit/delete pets (admin oversight)
- Rescue report admin view

---

## Before You Contribute

### 1. Pull and reinstall

- `git pull`
- `cd server && npm install`
- `cd ../app && npm install`

If `package.json` changed, you need fresh `node_modules`.

### 2. Re-sync your schema

Check if columns are missing:

- `DESCRIBE Users;` — should have `is_admin`
- `DESCRIBE Adoptions;` — should have `status`, `motivation`, `has_experience`, etc.

If missing, drop and remigrate, or write an `ALTER TABLE` patch and share it with the team.

### 3. Pick something to work on

Recommended order (smallest first):

- **Phase 0 UI** — endpoint already exists, just need a "Schedule Appointment" button + date picker
- **Community posts backend** — mirrors the adoption pattern almost exactly
- **Rescue reports backend** — same shape as community posts
- **Welfare checks** — new feature, fairly self-contained
- **Pet creation + photo upload** — multer involved, more complex

---
