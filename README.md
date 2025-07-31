# 🎯 Smart Attendance System using Face Recognition

A **Full Stack Web Application** for modern, real-time attendance tracking using **Face Recognition**. Built with **React (TypeScript)** on the frontend, **Spring Boot (Java)** on the backend, and **Python with OpenCV** for facial detection. The system features secure role-based access for students, staff, and administrators.

<img width="100%" alt="Landing Page" src="https://github.com/user-attachments/assets/bcff82fb-fab1-40f3-a451-56ac88e58654" />

---

## 🚀 Key Features

### ✅ Core Functionality

- 🔐 Secure login via Gmail/password  
- 👨‍🏫 Role-based dashboards for **Student**, **Staff**, and **Admin**  
- 📸 Mark attendance using **face recognition**  
- 📊 View attendance records in real time  
- 🧑‍💼 Admin control panel to manage users and records  
- 📱 Fully responsive UI across devices  

### ⚙️ Backend Capabilities

- REST APIs built with **Spring Boot**  
- Integrated with **Python (OpenCV)** for face recognition  
- **MySQL** database for persistent data storage  
- Attendance timestamping & role-based permissions  

---

## 🛠️ Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | React, TypeScript, Vite |
| Styling    | Tailwind CSS, Shadcn UI |
| Backend    | Java, Spring Boot       |
| Face Auth  | Python, OpenCV          |
| Database   | MySQL                   |
| Testing    | Postman                 |
| DevOps     | Git & GitHub            |

---

## 📷 UI Snapshots

### 🏠 Student Dashboard
<img width="100%" alt="Student Dashboard" src="https://github.com/user-attachments/assets/36eadc43-4fdc-4c64-97a1-fe11f2deea1c" />

---

### 🧑‍🏫 Staff Dashboard
<img width="100%" alt="Staff Dashboard" src="https://github.com/user-attachments/assets/41f84a7d-14c0-42f0-8851-81317a8a4b24" />

---

### 🎓 Admin Dashboard
<img width="100%" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/a9b9c85b-ed47-49e8-b14a-b983a3e5b676" />

---

## 👨‍💻 Our Team

<img width="100%" alt="Team" src="https://github.com/user-attachments/assets/d9530ac8-32e2-438a-854f-624a7ba2ca11" />

---

## 🔗 Project Structure

```
Smart-Attendance-System-Face-Recognition/
├── frontend/   # React app with TypeScript
└── backend/    # Spring Boot + Java + Python integration
```

---

## 📂 API Overview (Backend)

| Endpoint                      | Method | Description                      |
|-------------------------------|--------|----------------------------------|
| `/api/login`                 | POST   | Login with Gmail/password        |
| `/api/student/attendance`    | GET    | Fetch student attendance         |
| `/api/attendance/mark`       | POST   | Mark attendance using face image |
| `/api/admin/create-user`     | POST   | Create new student/staff user    |
| `/api/admin/view-attendance` | GET    | View attendance logs             |

> 💡 _Note: Face images are currently uploaded manually via Postman._

---

## ⚙️ Getting Started

### 🧪 Prerequisites

- Node.js
- Java 17+
- Python 3.8+
- MySQL

---

### 📦 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

### 🔧 Backend (Spring Boot)

1. Make sure **MySQL** is running.
2. Update DB credentials in `application.properties`.
3. Then run:

```bash
cd backend
./mvnw spring-boot:run
```

---

### 🧠 Face Recognition (Python)

> ⚠️ This runs separately as a service Python script.

```bash
cd backend/face_recognition
python face_recognition.py
```

Make sure camera permissions are enabled.

---

## 🔮 Future Improvements

- Automate image upload and training pipeline
- Integrate **JWT** for session-based auth
- Export reports in **Excel/PDF**
- Enable live webcam access on mobile
- Use cloud storage (S3/Cloudinary) for face data

---


---

