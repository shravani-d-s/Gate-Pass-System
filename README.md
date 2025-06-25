#  Gate Pass System

A full-stack Gate Pass System built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. It enables students to request gate passes online and allows guards to verify and manage those passes in real time.

---

##  Features

-  Student registration and login with ID card image upload
-  Guard login using college-issued ID number
-  Gate pass request and status tracking
-  Gate pass verification by guards
-  File uploads handled using Multer
-  JWT-based authentication
-  MongoDB for all user/gatepass data
-  React-based dynamic frontend

---

##  Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | React.js             |
| Backend      | Node.js, Express.js  |
| Database     | MongoDB, Mongoose    |
| Auth         | JWT, bcryptjs        |
| File Upload  | Multer               |
| Others       | dotenv, cors         |

---

##  Getting Started

### Backend Setup

```bash
cd gate-pass-system/backend
npm install
```

### Environment variables

Create .env in backend/
- MONGO_URI=your_mongodb_connection_string
- PORT=5000
- JWT_SECRET=your_jwt_secret


```bash
npm run dev
```

### Frontend Setup

```bash
cd gate-pass-system/frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

 ---

##  API Endpoints

### Auth Routes

| Method    | Endpoint           | Description                  |
|-----------|--------------------|------------------------------|
| POST      | /api/auth/register | Register user (student/guard)|
| POST      | /api/auth/login	   | Login and receive JWT (image)|

### Gate Pass Routes

| Method    | Endpoint              | Description                      |
|-----------|-----------------------|----------------------------------|
| POST      | /api/gatepass/request | Create a gate pass               |
| GET       | /api/gatepass/list	  | List all gate passes (guard only)|

---

## Screenshots

### Login page

![image](https://github.com/user-attachments/assets/d6f7451e-a4ec-441a-8a3c-2b1fadded2a0)

### Student Dashboard

![image](https://github.com/user-attachments/assets/646a0178-e845-47bf-af58-cfed3dbde107)
![image](https://github.com/user-attachments/assets/84413920-6a58-48ea-bfa4-ccb061611cce)

### Admin Dashboard

![image](https://github.com/user-attachments/assets/7c3d47a4-b631-403e-94ae-ba432aa66afe)

---
