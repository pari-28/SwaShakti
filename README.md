# 🛡️ SwaShakti
## Women's Safety, Mobility & Emergency Support Platform

<p align="center">
  <strong>Technology for safer mobility and connected support.</strong>
</p>

<p align="center">
  <a href="https://swa-shakti-rho.vercel.app/"><img src="https://img.shields.io/badge/Live%20Website-Visit%20SwaShakti-7C3AED?style=for-the-badge" alt="Live Website"></a>
  <a href="https://github.com/pari-28/SwaShakti"><img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github" alt="GitHub Repository"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Firebase-FCM-FFCA28?logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary">
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Vercel-Frontend%20Hosting-000000?logo=vercel" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-Backend%20Hosting-46E3B7?logo=render&logoColor=black" alt="Render">
</p>

SwaShakti is a full-stack, website-first women's safety and emergency-support platform. It brings together emergency SOS management, trusted-contact communication, location updates, evidence uploads, community incident reporting, and location-based risk information in a single application.

The project originated in the **Build for Good 2026 — AWAAZ track**. It is designed to reduce the friction of switching between separate tools when a user needs to alert trusted people, communicate location information, preserve supporting material, or learn from available community safety reports.

> **Safety notice:** SwaShakti is a support and awareness tool. It does not guarantee personal safety, automatically dispatch police or emergency responders, or replace official emergency services. Risk indicators and route information are advisory and depend on the available data, its quality, and the application's current logic.

---

## 🌐 Live Application

| Component | Link |
|---|---|
| **Live frontend** | [https://swa-shakti-rho.vercel.app/](https://swa-shakti-rho.vercel.app/) |
| **Backend API** | [https://swa-shakti.onrender.com](https://swa-shakti.onrender.com) |
| **Backend health check** | [https://swa-shakti.onrender.com/health](https://swa-shakti.onrender.com/health) |
| **GitHub repository** | [https://github.com/pari-28/SwaShakti](https://github.com/pari-28/SwaShakti) |

The frontend is hosted on Vercel and the backend is hosted on Render. The health endpoint confirms that the backend process responds; it does not independently verify database connectivity or every external integration.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Core Features](#-core-features)
  - [Authentication and User Accounts](#1-authentication-and-user-accounts)
  - [Emergency Contact Management](#2-emergency-contact-management)
  - [SOS Emergency Workflow](#3-sos-emergency-workflow)
  - [Emergency Notifications](#4-emergency-notifications)
  - [Location Tracking and Geocoding](#5-location-tracking-and-geocoding)
  - [Community Incident Reporting](#6-community-incident-reporting)
  - [Evidence Management](#7-evidence-management)
  - [Public Reference Data and Community Risk Analysis](#8-public-reference-data-and-community-risk-analysis)
  - [Maps, Nearby Risk and Route Planning](#9-maps-nearby-risk-and-route-planning)
  - [Route Deviation Monitoring](#10-route-deviation-monitoring)
  - [AI-Assisted Safety Support](#11-ai-assisted-safety-support)
  - [Community Report Analytics](#12-community-report-analytics)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [SOS Workflow](#-sos-workflow)
- [Risk Scoring Methodology](#-risk-scoring-methodology)
- [Database Design](#-database-design)
- [Backend API Overview](#-backend-api-overview)
- [Repository Structure](#-repository-structure)
- [Local Installation](#-local-installation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Implementation Status and Limitations](#-implementation-status-and-limitations)
- [Security and Privacy](#-security-and-privacy)
- [Testing Checklist](#-testing-checklist)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Team](#-team)
- [Disclaimer](#-disclaimer)

---

## 🎯 Project Overview

During a potentially unsafe situation, a person may need to:
1. Alert trusted people.
2. Communicate their current location.
3. Keep location information updated while an SOS is active.
4. Preserve relevant evidence.
5. Report an incident.
6. Understand safety information available for a place or route.

SwaShakti connects several of these workflows in one web application.

### Main objectives

- Provide a persistent SOS workflow with lifecycle management.
- Let users maintain trusted emergency contacts.
- Support location-aware emergency communication.
- Provide optional evidence upload and storage.
- Enable user-submitted community incident reports.
- Keep community reports distinct from imported public-reference records.
- Calculate transparent, rule-based risk indicators from available data.
- Provide map and route-related information without presenting estimates as safety guarantees.

### What SwaShakti is—and is not

- It is a **web application**, built with React, Vite and browser APIs.
- It is **not a native Android application**.
- It does not automatically dispatch police or connect to an official police dispatch system.
- It does not send SMS directly through the user's SIM and does not rely on Twilio/MSG91 in the documented implementation.
- Its current risk engine is **rule-based**, not a trained crime-prediction model.
- Absence of reports or a low score does not prove that an area is safe.

---

## ✅ Core Features

The descriptions below distinguish code-backed workflows from integrations whose latest production delivery still needs end-to-end verification.

### 1. Authentication and User Accounts

- User registration and login.
- Password hashing with `bcrypt`.
- JWT-based backend authentication.
- Protected API routes using Bearer tokens.
- Authenticated user identity is attached to requests by backend middleware.
- User-specific records are associated with the authenticated account.

The backend exposes authentication routes under `/api/auth` and a protected user profile route under `/api/user/profile`.

### 2. Emergency Contact Management

Users can maintain trusted emergency contacts for use during the SOS workflow.

- Add, retrieve, update and delete emergency contacts.
- Store name, phone number, relationship, country code, optional email and primary-contact status.
- Validate contact input on the backend.
- Keep contacts associated with the authenticated user.
- Prevent duplicate phone numbers within a user's contacts.
- Support primary-contact selection and promotion of another contact when the primary contact is deleted.
- Enforce the documented maximum of five contacts.

The database stores the country code separately from the national phone number. Email is optional in the current Prisma model.

### 3. SOS Emergency Workflow

The SOS workflow is the central emergency feature.

- Create a persistent SOS record with the authenticated user's ID, coordinates, status, optional message and timestamps.
- Prevent a second active SOS for the same user through the service-level active-alert check.
- Retrieve the user's active SOS.
- Update coordinates for an active SOS.
- Resolve or cancel an SOS through status updates.
- Record the resolution timestamp.
- Retrieve SOS history.
- Retry the notification workflow for an active SOS.
- Reconcile frontend active-SOS state with the backend to clear stale local state.

**Lifecycle:**

```text
User starts SOS
      |
      v
Backend authenticates user and validates request
      |
      v
Checks for an existing active SOS
      |
      +---- Active SOS exists ----> Conflict response
      |
      v
Creates SOSAlert record in PostgreSQL
      |
      v
Loads user, emergency contacts and available notification data
      |
      v
Attempts configured notification channels
      |
      v
Emits supported real-time events
      |
      v
Location updates can be sent while SOS is active
      |
      v
User resolves/cancels SOS
      |
      v
Status and resolution time are persisted
```

The active-alert check and creation are separate service operations; they should not be described as a database-level atomic concurrency guarantee.

### 4. Emergency Notifications

SwaShakti has separate notification mechanisms. They serve different purposes and have different requirements.

#### Email — Google Apps Script MailApp

The deployed email approach was migrated from Gmail SMTP to a Google Apps Script Web App using `MailApp`.

- Backend sends an HTTPS POST request to the configured Apps Script Web App.
- The request includes recipient and SOS details and a shared webhook secret.
- The Apps Script validates the secret and required fields.
- It builds a Google Maps location link, formats the timestamp for Asia/Kolkata, escapes HTML and calls `MailApp.sendEmail`.
- The email includes text and HTML content.

**Verification note:** A successful response from the Apps Script/email provider means the send request was accepted by that provider. It does not prove inbox delivery, absence of spam filtering, or that the recipient read the message. Verify the latest deployed end-to-end flow using a test mailbox that you control.

#### Firebase Cloud Messaging (FCM)

- Firebase Admin configuration is present in the backend.
- A user's FCM token can be saved through the authenticated API.
- The reviewed SOS service can send a push notification to the user's registered token.

FCM delivery to every emergency contact is **not established** by the reviewed implementation. A registered device token and supported client setup are required.

#### Socket.IO

- Socket.IO is attached to the backend HTTP server.
- The connection uses JWT-based authentication.
- SOS-related events are emitted for connected application clients.

Room membership and guardian/family subscription authorization require a production security review. Do not assume that every trusted contact receives a live socket stream.

#### Not included

- No direct SMS through the user's SIM.
- No documented Twilio/MSG91 SMS integration.
- No automatic police or emergency-responder dispatch.

### 5. Location Tracking and Geocoding

- Uses the browser Geolocation API, subject to device/browser permission.
- Supports high-accuracy position watching in the frontend location hook.
- Handles permission-denied, position-unavailable and timeout errors.
- Uses reverse geocoding to convert coordinates into readable place information.
- Applies movement/time thresholds to reduce unnecessary reverse-geocoding requests.
- Uses the Haversine formula for geographic distance calculations.

Location accuracy depends on the user's device, browser, permission settings, GPS availability and network conditions.

**Important distinction:** A user's current GPS position is not automatically the incident location entered in a community report. The report's original free-text location is retained; administrative fields and coordinates should only be saved when supported by the geocoding result.

### 6. Community Incident Reporting

Authenticated users can submit reports describing incidents or safety concerns.

- Submit an incident category and description.
- Provide a location as text.
- Optionally provide incident date/time.
- Attach supporting media where enabled.
- Store the report with the submitting user and timestamps.
- Attempt forward geocoding of the user-provided location.
- Populate city, district, state or coordinates only when the geocoder returns supporting information.

The system should not invent a district, locality or coordinate when a geocoding result does not support it. A geocoder can return ambiguous candidates; a resolved result is not necessarily independent verification of the incident location or report.

### 7. Evidence Management

- Upload files through an authenticated backend endpoint.
- Handle multipart file uploads with Multer.
- Store media in Cloudinary.
- Save evidence metadata and storage references in PostgreSQL.
- Associate evidence with an SOS record and user.
- Represent evidence types as `IMAGE`, `AUDIO` or `VIDEO`.

The actual enabled file formats and size limits are controlled by backend upload configuration. Evidence ownership and access-control checks should be reviewed carefully before production use, especially for retrieval by SOS ID.

### 8. Public Reference Data and Community Risk Analysis

SwaShakti keeps two data sources logically separate:

| Source | Meaning |
|---|---|
| `CommunityReport` | Reports submitted by SwaShakti users |
| `PublicReferenceIncident` | Imported public-reference crime records |

Public-reference records may be historical, aggregated or available only at city/district/state granularity. They must not be presented as verified, individually geolocated SwaShakti community incidents.

The risk services can combine relevant source records for area-level risk views while retaining source counts and source labels. The city-risk and area-risk services use different grouping approaches, so their outputs should not automatically be treated as identical.

### 9. Maps, Nearby Risk and Route Planning

- Interactive maps using React Leaflet and OpenStreetMap tiles.
- Risk-area markers and visualizations based on available coordinates.
- Nearby risk calculations based on geographic distance.
- Area-risk information based on location grouping.
- Route planning using the OSRM public driving-route service.
- Route geometry displayed on the map.
- Route distance and estimated duration returned by the routing service.
- Risk-area proximity information can be evaluated in relation to route geometry.

**Routing limitation:** The current route service uses OSRM driving directions. It is not a fully implemented A* risk-weighted pathfinding engine. Risk proximity is heuristic and depends on the available geolocated risk records. Map circles are illustrative visualizations, not official safety boundaries.

### 10. Route Deviation Monitoring

The frontend includes route-deviation logic that compares the user's current GPS position with route geometry.

- Handles cases where no route is available.
- Checks GPS validity and reported accuracy.
- Calculates distance from the current position to route segments.
- Classifies the result as on-route, off-route, GPS-unreliable or no-route.
- Uses consecutive readings to reduce noisy state changes.

The documented thresholds include an accuracy check around 50 metres, an off-route distance around 100 metres, and repeated readings before confirming or clearing a deviation. These are application heuristics, not guarantees of location accuracy.

Route deviation does **not** automatically trigger an SOS in the reviewed implementation.

### 11. AI-Assisted Safety Support

The backend contains Gemini-related services for explanatory risk analysis and safety-assistant responses.

- Risk analysis can explain an existing risk result.
- The safety assistant can return general contextual safety guidance.
- Prompts are designed to avoid inventing incidents, scores or locations.
- Fallback responses are available for certain AI-provider failures.

AI output is advisory and can be incomplete or incorrect. It does not replace verified local information or emergency services. The presence of an AI module or API key alone does not establish that every AI feature is enabled and working in the production frontend.

### 12. Community Report Analytics

- Authenticated endpoint for community-report analytics.
- Aggregates report counts over a recent seven-day period.
- Initializes daily buckets so days without reports can be represented.
- Provides data for dashboard visualization.

Date grouping depends on the backend's runtime timezone unless explicitly configured. Analytics describe records stored in the application, not a complete measure of real-world incidents.

---

## 🧰 Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 19, TypeScript, Vite | Browser interface and application state |
| Styling | Tailwind CSS | Responsive UI styling |
| Maps | Leaflet, React Leaflet | Interactive maps, markers and route visualization |
| Charts | Recharts | Analytics visualization |
| Animation | Motion | UI transitions and animation |
| Backend runtime | Node.js | Server-side JavaScript runtime |
| API framework | Express | HTTP routes and middleware |
| Backend language | TypeScript | Typed server-side code |
| ORM | Prisma | Database queries and schema management |
| Database | PostgreSQL | Persistent relational data |
| Database adapter | `@prisma/adapter-pg`, `pg` | PostgreSQL connectivity |
| Authentication | `bcrypt`, `jsonwebtoken` | Password hashing and JWT authentication |
| Validation | Zod | Request validation |
| Real-time | Socket.IO | Authenticated real-time application events |
| Upload handling | Multer | Multipart file handling |
| Media storage | Cloudinary | Evidence file storage |
| Push messaging | Firebase Admin / FCM | Device push messaging capability |
| Email | Google Apps Script Web App / MailApp | SOS email send workflow |
| AI | Google Gemini API (`@google/genai`) | AI-assisted explanations and responses |
| Geocoding | OpenStreetMap Nominatim | Forward and reverse geocoding |
| Routing | OSRM | Driving-route directions |
| Frontend hosting | Vercel | Production web hosting |
| Backend hosting | Render | Production API hosting |
| Database hosting | PostgreSQL provider (Neon in recorded deployment) | Hosted database |

---

## 🏛️ System Architecture

SwaShakti follows a client-server architecture. The browser communicates with the backend through REST APIs and Socket.IO. The backend applies authentication, validation and business rules, then accesses PostgreSQL through Prisma or calls an external provider.

```text
                         USER / BROWSER
                               |
                               v
                 React + TypeScript + Vite
                       Frontend (Vercel)
                               |
                      REST API / Socket.IO
                               |
                               v
                 Node.js + Express + TypeScript
                       Backend (Render)
                               |
              Routes -> Middleware -> Controllers
                               |
                            Services
                    /          |          \
                   v           v           v
              PostgreSQL   External APIs   Socket.IO
                Prisma        / SDKs       events
                   |           |
                   |     +-----+------------------------------+
                   |     |       |        |        |           |
                   v     v       v        v        v           v
                Users  MailApp Firebase Cloudinary Nominatim  OSRM
              Contacts  Email    FCM     Evidence  Geocoding Routing
                SOS
              Reports
              Evidence
          PublicReferenceIncident
```

### Typical API request lifecycle

1. The user performs an action in the React frontend.
2. The frontend sends an HTTP request to the Express backend.
3. Authentication middleware verifies the JWT for protected routes.
4. Validation middleware checks request data where configured.
5. A controller handles the HTTP request.
6. A service applies business rules and coordinates external integrations.
7. Prisma reads or writes PostgreSQL records.
8. The backend returns a response and, for supported workflows, emits real-time events.

---

## 🚨 SOS Workflow

The SOS workflow connects several modules:

| Stage | What happens |
|---|---|
| Initiation | User triggers SOS in the frontend |
| Authentication | Backend identifies the user from the JWT |
| Validation | Incoming coordinates and optional message are validated |
| Duplicate protection | Service checks for an existing active SOS |
| Persistence | `SOSAlert` is created in PostgreSQL |
| Contacts | Emergency contacts are retrieved for the user |
| Email | Backend attempts the configured Apps Script/MailApp email workflow |
| Push | FCM may be sent to the user's registered device token |
| Real-time | Supported Socket.IO events are emitted |
| Location | Active SOS coordinates can be updated |
| Resolution | Status and `resolvedAt` are updated |
| History | User can retrieve their SOS history |

The application reports provider acceptance separately from verified final email delivery. Each communication channel has its own availability and client-side requirements.

---

## 📊 Risk Scoring Methodology

The current risk engine is **rule-based**. It uses manually assigned category weights, an average-weight formula and fixed thresholds. The weights and thresholds are provisional and have not been empirically validated.

### Data sources

- Public-reference incidents from `PublicReferenceIncident`.
- User-submitted reports from `CommunityReport` (the documented city-risk calculation includes reports with `SUBMITTED` status).

These sources remain separate in storage and are tracked separately in combined area-level results.

### Current category weights

**Public-reference incident weights**

| Category | Weight |
|---|---:|
| HOMICIDE | 10 |
| SEXUAL ASSAULT | 10 |
| KIDNAPPING | 9 |
| ASSAULT | 8 |
| ROBBERY | 8 |
| EXTORTION | 7 |
| ARSON | 7 |
| BURGLARY | 6 |
| VEHICLE - STOLEN | 5 |
| DRUG OFFENSE | 5 |
| VANDALISM | 4 |
| CYBERCRIME | 4 |
| IDENTITY THEFT | 3 |
| FRAUD | 3 |
| COUNTERFEITING | 3 |
| PUBLIC INTOXICATION | 2 |

**Community-report weights**

| Category | Weight |
|---|---:|
| HARASSMENT | 7 |
| STALKING | 8 |
| UNSAFE AREA | 6 |
| THEFT | 5 |
| ASSAULT | 8 |
| VERBAL ABUSE | 5 |
| SUSPICIOUS ACTIVITY | 6 |
| OTHER | 3 |

Missing or unrecognized categories receive a fallback weight of `3`.

### Formula

\[
\text{Risk Score} =
\left(\frac{\text{Sum of Category Weights}}{\text{Incident Count}}\right)
\times 10
\]

For example, weights of 8, 6 and 4 produce an average weight of 6 and a score of 60. This is an illustrative calculation, not a statement about actual incident records.

### Risk classification

| Risk level | Score |
|---|---:|
| LOW | Below 40 |
| MEDIUM | 40 to below 70 |
| HIGH | 70 or above |

### Important interpretation limits

- The score primarily represents the average assigned severity of included categories.
- Incident count does not directly increase the score when average category weight remains unchanged.
- The score is **not** a probability of crime, a prediction of future incidents, or a statistically calibrated measure of personal safety.
- Public-reference data and user reports may differ in coverage, reliability and geographic precision.
- Aggregate city/district statistics must not be represented as exact incident locations.
- A missing record or LOW score does not mean the area is safe.
- Location normalization can group different spellings, but it cannot guarantee that all grouped place names refer to the same real-world area.

The complete methodology is documented in [`docs/RISK_SCORING_METHODOLOGY.md`](docs/RISK_SCORING_METHODOLOGY.md).

---

## 🗄️ Database Design

The current Prisma schema defines these principal models:

| Model | Purpose |
|---|---|
| `User` | User account, identity and FCM token |
| `EmergencyContact` | Trusted contacts linked to a user |
| `SOSAlert` | SOS coordinates, status, message and lifecycle timestamps |
| `Evidence` | Uploaded evidence metadata and Cloudinary reference |
| `CommunityReport` | User-submitted incident reports and optional location/evidence fields |
| `PublicReferenceIncident` | Imported public-reference crime records |

### Main relationships

```text
User
 ├── EmergencyContact[]
 ├── SOSAlert[]
 │     └── Evidence[]
 ├── Evidence[]
 └── CommunityReport[]

PublicReferenceIncident
 └── Independent imported reference records
```

`CommunityReport` and `PublicReferenceIncident` are deliberately separate. This preserves data provenance and avoids presenting imported reference records as user-submitted community reports.

The full schema is available at [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

---

## 🔌 Backend API Overview

The following paths are registered in the backend server and route files. Protected routes require a valid Bearer token unless noted otherwise. Check the route validators and controllers for exact payload schemas and response bodies.

| Route group | Method | Path | Purpose |
|---|---|---|---|
| Health | `GET` | `/health` | Backend process health response |
| Auth | `POST` | `/api/auth/register` | Register a user |
| Auth | `POST` | `/api/auth/login` | Log in |
| Auth | `POST` | `/api/auth/fcm-token` | Save the authenticated user's FCM token |
| Auth | `GET` | `/api/auth/me` | Get current authenticated user |
| User | `GET` | `/api/user/profile` | Protected profile endpoint |
| Emergency contacts | `POST` | `/api/emergency` | Add a contact |
| Emergency contacts | `GET` | `/api/emergency` | List contacts |
| Emergency contacts | `PUT` | `/api/emergency/:id` | Update a contact |
| Emergency contacts | `DELETE` | `/api/emergency/:id` | Delete a contact |
| Emergency contacts | `PATCH` | `/api/emergency/:id/primary` | Set primary contact |
| SOS | `GET` | `/api/sos/active` | Get active SOS |
| SOS | `POST` | `/api/sos` | Create SOS |
| SOS | `PATCH` | `/api/sos/:id/location` | Update active SOS location |
| SOS | `PATCH` | `/api/sos/:id/status` | Update SOS status |
| SOS | `POST` | `/api/sos/:id/resend` | Retry SOS notification workflow |
| SOS | `GET` | `/api/sos/history` | Get SOS history |
| Evidence | `POST` | `/api/evidence/upload` | Upload evidence (`multipart/form-data`, field `file`) |
| Evidence | `GET` | `/api/evidence/:sosId` | Retrieve evidence for an SOS |
| Community reports | `POST` | `/api/community-reports` | Submit a report (optional file field `file`) |
| Community reports | `GET` | `/api/community-reports/my` | Retrieve the authenticated user's reports |
| Risk | `GET` | `/api/risk/cities` | Get city risk results |
| Risk | `GET` | `/api/risk/cities/:city` | Get risk for a city |
| Risk | `GET` | `/api/risk/areas` | Get area risk results |
| Risk | `GET` | `/api/risk/areas/:location` | Get risk for a location |
| Location | `—` | `/api/location` | Location route group; inspect route file for current subpaths |
| AI | `—` | `/api/ai` | AI route group; inspect route file for current subpaths |
| Analytics | `—` | `/api/analytics` | Analytics route group; inspect route file for current subpaths |

Protected API example:

```http
Authorization: Bearer <JWT>
```

The `/health` endpoint confirms that the server process responds. It is not a readiness check for PostgreSQL or external services.

---

## 📁 Repository Structure

Simplified overview of the repository:

```text
SwaShakti/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── server.ts
│   ├── package.json
│   └── ...
├── data/
├── docs/
│   └── RISK_SCORING_METHODOLOGY.md
├── public/
├── src/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── services/
│   └── ...
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Local Installation

### Prerequisites

- Node.js and npm.
- PostgreSQL database.
- Firebase project credentials for enabled Firebase features.
- Cloudinary account for evidence storage.
- Google Apps Script Web App deployment for email notifications.
- Gemini API key for AI-related services.

### 1. Clone the repository

```bash
git clone https://github.com/pari-28/SwaShakti.git
cd SwaShakti
```

### 2. Install frontend dependencies

From the repository root:

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create the frontend `.env` and backend `backend/.env` files using the tables below. Use your own credentials and local service URLs.

### 5. Generate Prisma Client and apply migrations

From `backend/`:

```bash
npx prisma generate
npx prisma migrate dev
```

Use the migration workflow appropriate to your environment. Do not use destructive reset commands against a production database.

### 6. Start the backend in development mode

From `backend/`:

```bash
npm run dev
```

The backend development script runs `tsx src/server.ts`. The default local port is `5001`, unless `PORT` is configured differently.

For a production-style local build:

```bash
npm run build
npm start
```

The production start script runs `node dist/server.js`.

### 7. Start the frontend

Open a second terminal at the repository root:

```bash
npm run dev
```

Vite is configured to use port `3000`.

### 8. Build the frontend

From the repository root:

```bash
npm run build
```

The frontend production output is written to `dist/`.

---

## 🔐 Environment Variables

Environment variable names must match the code/configuration deployed in the relevant frontend or backend. The `.env.example` currently contains frontend Firebase and Cloudinary examples; the production backend also uses additional variables described below.

### Frontend — root `.env`

```env
VITE_API_URL=http://localhost:5001

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

- `VITE_API_URL` points to the backend API base URL.
- `VITE_FIREBASE_*` values configure the browser Firebase client where used.
- Vite exposes `VITE_` variables to the browser bundle. Never put private keys or server secrets in these variables.

### Backend — `backend/.env`

```env
PORT=5001
FRONTEND_URL=http://localhost:3000

DATABASE_URL=
JWT_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GOOGLE_APPS_SCRIPT_URL=
SWASHAKTI_WEBHOOK_SECRET=

GEMINI_API_KEY=
```

| Variable | Purpose |
|---|---|
| `PORT` | Backend HTTP server port |
| `FRONTEND_URL` | Frontend origin allowed by backend CORS |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used for JWT signing and verification |
| `FIREBASE_PROJECT_ID` | Firebase project ID for Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | Firebase service-account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service-account private key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GOOGLE_APPS_SCRIPT_URL` | Deployed Apps Script Web App URL used for email |
| `SWASHAKTI_WEBHOOK_SECRET` | Shared secret used to authenticate backend-to-script requests |
| `GEMINI_API_KEY` | Gemini API key for AI-related backend services |

The exact backend environment configuration should be checked against the latest backend config files before deployment. Firebase private-key newline formatting must match the backend initialization code.

**Never commit `.env`, `backend/.env`, private keys, app passwords, database URLs, JWT secrets or webhook secrets.** Use the hosting provider's environment-variable settings for production.

---

## 🚀 Deployment

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Configure the frontend project using the repository root.
3. Add `VITE_API_URL` with the deployed backend base URL.
4. Add the required frontend Firebase `VITE_` configuration values, if used.
5. Deploy and verify the generated domain in Vercel project settings.

Production frontend:

`https://swa-shakti-rho.vercel.app/`

### Backend — Render

The backend is deployed separately from the frontend.

Typical backend configuration from the project deployment:

- **Root directory:** `backend`
- **Build command:**

```bash
npm install --include=dev && npx prisma generate && npm run build
```

- **Start command:**

```bash
npm start
```

Configure backend environment variables in Render. Set `FRONTEND_URL` to the deployed Vercel origin and `DATABASE_URL` to the production PostgreSQL connection string.

Production backend:

`https://swa-shakti.onrender.com`

Health endpoint:

`https://swa-shakti.onrender.com/health`

### External service configuration

- Configure Firebase Admin credentials for backend messaging.
- Configure the browser Firebase client separately where needed.
- Configure Cloudinary credentials for evidence uploads.
- Deploy the Google Apps Script Web App with the intended execution/access settings and matching webhook secret.
- Configure the Gemini API key for AI-related functionality.
- Confirm PostgreSQL network access and migrations.

A successful frontend deployment or `/health` response does not prove that all external integrations are operational.

---

## 🧭 Implementation Status and Limitations

This section intentionally distinguishes what is implemented from what is configured, partially verified or planned.

| Capability | Status in available project records |
|---|---|
| React + TypeScript + Vite frontend | Implemented and deployed |
| Express + TypeScript backend | Implemented and deployed |
| PostgreSQL + Prisma | Implemented; production DB connectivity should be checked independently |
| JWT authentication and protected API | Implemented; manual workflow documented |
| Emergency contact management | Implemented and manually tested |
| SOS creation, active state, updates, resolution and history | Implemented and manually tested |
| Email through Apps Script MailApp | Implemented/deployed; latest end-to-end inbox delivery needs verification |
| FCM | Configured; push delivery to the user's registered token is supported by reviewed code, latest production delivery needs verification |
| Socket.IO | Implemented; room membership/guardian authorization require further security review |
| Browser geolocation | Implemented; subject to browser/device permission and GPS accuracy |
| Community reporting and geocoding | Implemented; geocoding can be ambiguous and location precision varies |
| Cloudinary evidence upload | Implemented; verify production access control and allowed formats |
| Public-reference data import | Implemented in project history; coverage/granularity varies by source |
| Rule-based city/area risk analysis | Implemented; methodology and weights are provisional |
| Nearby and Area Risk UI | Manually tested in development history |
| OSRM route planning | Implemented in the reviewed application flow |
| Route risk proximity | Heuristic; depends on available geolocated risk data |
| Route deviation | Implemented as a guidance signal; does not automatically trigger SOS |
| Gemini-assisted risk explanation/safety assistant | Backend services exist; production end-to-end use needs verification |
| Advanced A* risk-weighted route optimization | Not established as implemented |
| Automatic police dispatch | Not implemented |
| SMS through SIM / Twilio / MSG91 | Not implemented |
| Hardware-triggered SOS / smartwatch support | Roadmap, not established as implemented |

### Known engineering and data limitations

- Risk weights and thresholds are manually configured and not empirically validated.
- The average-weight formula does not directly account for total incident frequency.
- Public-reference datasets may be aggregate statistics rather than incident-level records with precise coordinates.
- Geocoding can return ambiguous candidates and should not be treated as verification.
- City-coordinate markers are representative area points, not exact incident pins.
- Route-risk evaluation is heuristic, not a guaranteed safest-route calculation.
- GPS accuracy can vary significantly by device and environment.
- Email provider acceptance does not guarantee inbox delivery.
- FCM delivery requires a registered and functioning device token/client.
- Socket.IO room and family/guardian authorization need careful review before relying on them for sensitive sharing.
- Evidence access must be protected by ownership checks.
- The backend health endpoint is a process health check, not a full dependency readiness check.

---

## 🔒 Security and Privacy

SwaShakti handles sensitive information such as account details, contact information, location data, incident descriptions and evidence files. These areas require careful access control.

- Keep secrets in environment variables and never commit them.
- Protect user-specific endpoints with authentication.
- Enforce ownership checks when retrieving or modifying SOS, contacts, reports and evidence.
- Do not log passwords, access tokens, private keys, webhook secrets or unnecessary personal/location data.
- Use test accounts and test recipients when validating emergency workflows.
- Obtain appropriate consent before using real emergency contacts for tests.
- Review uploaded-evidence access, retention and deletion policies.
- Treat community reports as user-submitted information, not automatically verified facts.
- Use secure production CORS configuration and provider rules.
- Review Socket.IO room authorization before enabling trusted-contact sharing.

---

## 🧪 Testing Checklist

Before a demo or production release, validate the complete workflows in a controlled environment.

- [ ] Register, log in and access protected routes.
- [ ] Create, update, delete and set a primary emergency contact.
- [ ] Confirm the five-contact limit and duplicate-phone validation.
- [ ] Create an SOS and verify duplicate-active-SOS handling.
- [ ] Retrieve active SOS and SOS history.
- [ ] Update SOS location and resolve/cancel the alert.
- [ ] Test email delivery using a mailbox you control.
- [ ] Verify FCM on a registered test device.
- [ ] Verify authenticated Socket.IO connection and intended event/room authorization.
- [ ] Test browser location permission denied, unavailable and timeout cases.
- [ ] Submit a community report with an unambiguous and an ambiguous location.
- [ ] Confirm public-reference records remain separate from community reports.
- [ ] Upload allowed evidence formats and test unauthorized retrieval.
- [ ] Test risk calculations with known category weights and score boundaries.
- [ ] Check maps with missing or approximate coordinates.
- [ ] Test OSRM route errors and route-deviation GPS edge cases.
- [ ] Test AI provider unavailable/fallback behavior.
- [ ] Verify production CORS, database connectivity and migrations.

**Do not test SOS by sending alerts to real emergency contacts without their knowledge and explicit consent.**

---

## 🛣️ Future Enhancements

Potential next steps include:

- More rigorous validation and explainability of risk scoring.
- Better confirmation of ambiguous geocoding candidates.
- Improved geospatial indexing and route-to-risk distance calculations.
- Further evaluation of safety-aware route optimization.
- Stronger trusted-contact real-time subscription and authorization.
- End-to-end notification monitoring and safe test workflows.
- Comprehensive authorization, privacy and integration tests.
- Better deployment readiness checks and observability.
- Further multilingual and accessibility improvements.
- Exploration of hardware-triggered and wearable support.

These are roadmap ideas, not claims of current completed functionality.

---

## 🤝 Contributing

Contributions, bug reports and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and follow the existing frontend/backend conventions.
4. Add or update tests where applicable.
5. Run the relevant frontend build and backend checks.
6. Open a pull request with a clear description and testing notes.

Please do not include credentials, real emergency-contact details, private user data or sensitive location information in issues, commits or test fixtures.

---

## 👩‍💻 Team

**Team SwaShakti — Build for Good 2026**

- **Pari Sangamnerkar**
- **Yash Shivnani**

---

## 🙏 Acknowledgements

- Build for Good 2026 and the AWAAZ track.
- Open-source communities behind React, Node.js, PostgreSQL, Prisma, Leaflet, Socket.IO and the other tools used in this project.
- The providers of Firebase, Cloudinary, Google Apps Script, OpenStreetMap Nominatim, OSRM and Google Gemini services.

---

## ⚖️ Disclaimer

SwaShakti is an academic and software-development project intended to support safety awareness and emergency communication workflows. It is not a certified emergency-response system. It does not guarantee personal safety, verify every community report, automatically dispatch police, or replace local emergency services. GPS, geocoding, route estimates, AI responses and risk indicators may be incomplete or inaccurate. In an immediate emergency, contact the appropriate local emergency services.
