# 🛡️ SwaShakti
## AI-Assisted Women's Safety Platform

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black?logo=socket.io)
![Firebase](https://img.shields.io/badge/Firebase-FCM-FFCA28?logo=firebase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)

> **Empowering Every Journey with Intelligent Safety.**

SwaShakti is a full-stack women's safety web application designed to support emergency response, location sharing, evidence collection, and community-driven safety intelligence.

Developed for **Build for Good 2026**, the project combines a React frontend, a Node.js/Express backend, PostgreSQL data storage, real-time communication, cloud media storage, and safety-risk visualizations.

> **Safety notice:** SwaShakti is a support tool, not a replacement for emergency services. Risk indicators and route information are advisory and cannot guarantee that a place or journey is safe.

---

## 🌐 Live Demo

- **Frontend:** https://swa-shakti-rho.vercel.app
- **Backend health check:** https://swa-shakti.onrender.com/health

Availability depends on the deployment and its configured services.

---

## 🎯 Problem Statement

During a safety incident, a person may need to contact trusted people, share their location, and preserve relevant evidence quickly. Switching between separate tools can add friction during a stressful situation.

SwaShakti brings emergency alerts, emergency-contact management, location sharing, evidence upload, and community safety information into one application.

## 💡 Solution

SwaShakti provides a unified interface for:
- Triggering and managing an SOS session
- Notifying configured emergency contacts by email
- Sharing location information during an SOS
- Managing emergency contacts
- Uploading evidence to cloud storage
- Reporting community incidents
- Viewing location-related risk information and analytics

Some advanced safety and AI capabilities remain under development; see [Current Capabilities and Roadmap](#-current-capabilities-and-roadmap).

---

## ✅ Implemented Features

### 🚨 SOS and Emergency Email Alerts
- SOS activation and active-session management
- Location capture and location details in emergency notifications
- Email notifications to configured emergency contacts
- Resend emergency alert email workflow
- SOS status updates and real-time event communication

Email delivery depends on valid backend email configuration and the recipient's mail service.

### 📍 Location and Real-Time Communication
- Browser-based location access when permission is granted
- Socket.IO communication for real-time updates
- Live location sharing as supported by the active SOS workflow
- Location-aware risk information

Location accuracy and availability depend on the device, browser permissions, and connectivity.

### 👥 Emergency Contacts
- Add and manage multiple emergency contacts
- Store contact details in PostgreSQL
- Integrate emergency contacts with the SOS notification workflow
- Persist contacts across page refreshes

### 🔐 Authentication
- User registration and login
- JWT-based API authentication
- Protected backend routes

### 📷 Secure Evidence Upload
- Upload evidence files through the application
- Cloudinary-backed media storage
- Evidence records associated with the relevant SOS where supported
- Database-backed evidence metadata

Use test data when validating uploads. Access and retention depend on application configuration and the storage provider.

### 🧭 Area Risk and Nearby Risk
- Display location-related risk information
- Nearby Risk results based on a geographic radius and available coordinates
- Area Risk information for the selected or nearest mapped risk record
- Expandable and minimizable risk cards
- Community reports and public reference data used as separate data sources where applicable

Nearby results require usable coordinates. Public reference statistics may be aggregated and may not identify individual incident locations. Risk scores are advisory and should not be interpreted as verified predictions of future crime.

### 🗣️ Community Safety Reporting
- Submit community incident reports
- Record incident descriptions and location information
- Support evidence upload where configured
- Use community report data in safety visualizations and risk analysis

Location fields should only be populated when supported by the available geocoding result. Missing coordinates or administrative fields should not be guessed.

### 📊 Analytics
- Community-report and safety overview visualizations
- Risk-related summaries
- Dashboard analytics based on available application data

The accuracy and coverage of analytics depend on the quality and completeness of the underlying records.

### ☁️ Cloud and Infrastructure
- PostgreSQL database with Prisma ORM
- Cloudinary for media storage
- Firebase Cloud Messaging integration
- Vercel frontend deployment
- Render backend deployment

---

## 🧠 Current Capabilities and Roadmap

SwaShakti combines implemented emergency-response workflows with developing safety-intelligence features. Related functionality does not necessarily mean that every advanced AI capability is complete.

### Implemented or available in the current application
- SOS workflow and emergency-contact email notifications
- Emergency-contact management
- Location-aware Area Risk and Nearby Risk displays
- Community incident reporting
- Route planning and risk-related information, where available in the current deployment
- Route-deviation functionality, where available in the current deployment
- Evidence upload
- Dashboard analytics and community safety visualizations

### Planned or evolving
- Further validation and refinement of risk predictions
- Advanced AI-assisted safety recommendations
- Distress voice recognition and automatic distress detection
- GPS-to-landmark translation
- Bhashini multilingual integration
- AI-generated fake calls
- Hardware-triggered SOS
- Expanded predictive safety analytics
- Offline SOS and smartwatch integration

Do not treat a roadmap item as implemented unless it has been verified in the current application and deployment.

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Leaflet
- Recharts
- Framer Motion
- Socket.IO Client

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Socket.IO
- JWT authentication
- Multer
- Cloudinary SDK

### Database and Services
- PostgreSQL (Neon deployment)
- Firebase Cloud Messaging
- Cloudinary

### Deployment
- Vercel (frontend)
- Render (backend)

---

## 🔄 High-Level Workflow

```text
User registers or logs in
          |
          v
Configures emergency contacts
          |
          v
Uses dashboard, location and risk information
          |
          +------------------------------+
          |                              |
          v                              v
Submits community report          Activates SOS
          |                              |
          v                              v
Community risk views             SOS session and location
                                         |
                                         v
                              Emergency contact email alerts
                                         |
                                         v
                              Evidence upload, if required
```

The exact flow depends on permissions, network connectivity, and configured services.

---

## 🏛️ Architecture

```text
React + Vite Frontend
        |
        | REST APIs / Socket.IO
        v
Node.js + Express Backend
        |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
 PostgreSQL            Cloudinary       Firebase services
 (via Prisma)          Evidence media   FCM / configured features
```

---

## 📊 Project Status

| Area | Status |
|---|---|
| Authentication | Manually tested |
| Emergency contacts | Manually tested |
| SOS and email alerts | Manually tested |
| Nearby Risk and Area Risk | Manually tested |
| Community reporting | Manually tested |
| Evidence upload | Manually tested |
| Frontend production build | Successful |
| Backend TypeScript validation | Known errors remain; see Development Notes |
| Advanced AI roadmap features | Planned or evolving as listed above |

The workflow statuses reflect manual checks performed during development, not an independent security audit or guarantee of production reliability.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js and npm
- Access to a PostgreSQL database
- Firebase project configuration for the features you use
- Cloudinary account for evidence uploads
- Email account configured for backend email delivery

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
cd ..
```

### 4. Configure frontend environment variables

Create a `.env` file in the repository root. Use the variable names expected by the frontend:

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

Fill in values from your own Firebase project and local backend configuration. Confirm the frontend uses these exact variable names before deploying.

### 5. Configure backend environment variables

Create `backend/.env`:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5001

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

EMAIL_USER=
EMAIL_APP_PASSWORD=
```

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: a strong, unique secret for signing tokens.
- `PORT`: backend listening port; the example uses `5001`.
- `CLOUDINARY_*`: credentials for evidence media storage.
- `FIREBASE_*`: service-account configuration used by the backend, if enabled.
- `EMAIL_USER`: dedicated sender account used for SOS email alerts.
- `EMAIL_APP_PASSWORD`: app password for the sender account when using Gmail SMTP.

For `FIREBASE_PRIVATE_KEY`, follow the newline format expected by the backend configuration. Do not commit `.env` files or paste secrets into issues, logs, screenshots, or public repositories.

**Never put backend-only secrets in frontend variables.** Variables prefixed with `VITE_` are exposed to client-side code.

### 6. Start the backend

In one terminal:

```bash
cd backend
npm start
```

The backend package defines both `npm start` and `npm run dev` to run `tsx src/server.ts`.

### 7. Start the frontend

In a second terminal, from the repository root:

```bash
npm run dev
```

The root package starts Vite on port `3000`.

### 8. Build the frontend for production

From the repository root:

```bash
npm run build
```

The production output is generated in `dist/`.

---

## 🔌 API Overview

The following are representative endpoints documented in the project. Exact routes and request formats should be checked against the current backend route files.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/user/profile` | Retrieve the user profile |
| `POST` | `/api/sos` | Create an SOS alert |
| `GET` | `/api/sos/active` | Retrieve the active SOS |
| `PATCH` | `/api/sos/:id/status` | Update SOS status |
| `POST` | `/api/evidence/upload` | Upload emergency evidence |
| `GET` | `/api/evidence/:sosId` | Retrieve evidence for an SOS |

Additional endpoints may be available for emergency contacts, community reports, risk information, analytics, and resending SOS notifications.

---

## 🔒 Security and Privacy Notes

- Keep `.env` and `backend/.env` out of version control.
- Use `.env.example` only for placeholder values.
- Never commit Firebase Admin private keys, email app passwords, database connection strings, or JWT signing secrets.
- Frontend Firebase configuration keys are visible to clients by design; secure Firebase services with appropriate rules and API-key restrictions.
- Avoid logging credentials or full connection strings.
- Validate user input and protect sensitive API routes.
- Use test contacts and test records when verifying emergency workflows.
- Review retention, access controls, and permissions for uploaded evidence.

---

## 🧪 Testing and Development Notes

The following workflows have been manually tested during development:
- Registration/login and dashboard access
- Emergency contact persistence
- SOS creation and email alerts
- Nearby Risk and Area Risk displays
- Community report submission and persistence
- Evidence upload and access

The frontend production build completed successfully during the latest check. Vite reported a large JavaScript chunk warning; this is a performance optimization opportunity rather than a build failure.

The backend TypeScript command `npx tsc --noEmit` currently reports errors in multiple files, including configuration, request-handler typing, route parameters, and community-report geocoding. These errors require a separate review. A successful manual workflow test does not mean the backend type check is clean.

---

## 🚧 Future Enhancements

Potential future work includes:
- Improved validation and explainability of risk analysis
- More robust route-safety evaluation
- Additional multilingual accessibility
- Offline-friendly emergency flows
- Optional hardware and wearable integrations
- Expanded predictive analytics after appropriate data validation
- Performance optimization and frontend code splitting
- Automated integration and regression tests

---

## 👩‍💻 Team

### Team SwaShakti — Build for Good 2026
- Pari Sangamnerkar
- Yash Shivnani

Built with ❤️ for safety, accessibility, and social impact.

## 📄 License

Developed as part of **Build for Good 2026** for educational and social-impact purposes. Add a specific open-source license file if you intend to grant reuse and redistribution rights.

## 🙏 Acknowledgements

Thanks to the Build for Good 2026 organizers, mentors, and open-source communities whose tools and resources support projects for social impact.
