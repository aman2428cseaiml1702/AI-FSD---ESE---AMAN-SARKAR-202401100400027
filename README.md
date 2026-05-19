# AI-Based Smart Complaint Management System

This is a full-stack MERN application that allows users to register complaints online. The system features AI integration to automatically classify complaint priority, suggest the responsible department, and generate automatic response messages. 

## Features
- **Frontend:** React, React Router, Axios, Custom CSS (Modern UI)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT & bcrypt
- **AI Integration:** Simulated AI Analyzer for Priority & Summarization

## Folder Structure
- `/backend` - Express Server & MongoDB Models
- `/frontend` - React User Interface

## Prerequisites
- Node.js installed
- MongoDB installed (or use MongoDB Atlas URI)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd Smart-Complaint-System
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/complaint_system
   JWT_SECRET=yoursecretkey
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application locally:**
   - Start the backend server:
     ```bash
     cd backend
     npm run dev # or node index.js
     ```
   - Start the frontend dev server:
     ```bash
     cd frontend
     npm run dev
     ```

## Deployment on Render
To deploy on Render, create a New Web Service:
1. Connect this repository.
2. Root Directory: `backend`
3. Build Command: `cd ../frontend && npm install && npm run build && cd ../backend && npm install`
4. Start Command: `node index.js`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your JWT Secret>`
