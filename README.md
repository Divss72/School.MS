# Precision School Management System (School.MS)

## 1. Project Overview
A comprehensive, production-grade School Management System designed to bridge the gap between students and administration. The system provides integrated tools for academic tracking, performance reporting, and official communication.

## 2. Tech Stack
- **Frontend**: React.js, Tailwind CSS (optional), Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js (Modular MVC).
- **Database**: MongoDB (Supports Cloud Atlas & In-Memory Mode).
- **Authentication**: JWT, HTTP-only Cookies, Bcrypt.

## 3. Setup Instructions

### Backend
1. Navigate to `backend/`
2. Run `npm install`
3. Create `.env` from `.env.example`
4. Run `npm start`

### Frontend
1. Navigate to `frontend/`
2. Run `npm install`
3. Create `.env` from `.env.example`
4. Run `npm run dev`

## 4. API Endpoints
- **GET/POST `/api/v1/students`**: Manage student profiles and linked accounts.
- **GET/POST `/api/v1/tasks`**: Assignment management for students and admins.
- **GET/POST `/api/v1/notices`**: School-wide announcements and board management.
- **GET/POST `/api/v1/complaints`**: Student complaint lodging and admin resolution.
- **GET/POST `/api/v1/activities`**: Extra-curricular enrollment and activity tracking.

## 5. Features
- **Dashboard**: Real-time academic overview and statistics.
- **Notice Board**: Categorized school announcements (Exam, Holiday, News).
- **Study Section**: Repository for study materials and resources.
- **Admin Controls**: Robust student management and configuration tools.
- **Reports**: Automatic progress reports and result tracking.

## 📄 License
Project developed as part of academic research. All rights reserved.
