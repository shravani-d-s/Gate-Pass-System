#  Gate Pass System

A full-stack Gate Pass System built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. It enables students to request gate passes online and allows guards to verify and manage those passes in real time.

---

##  Features

-  Student registration with ID card image upload and login with email(vnit email only)
-  Guard login using college-issued ID number(use GTVNIT001-GTVNIT005 for trial)
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
| Deployment   | Atlas, Render, Vercel|

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
| GET       | /api/gatepass/list	   | List all gate passes (guard only)|

---

##  Improvements

1. Host the project on a good paid platform.
2. Improve the User Interface.
3. Verifying Image to be implemented using a Vnit specific id detector.

---
