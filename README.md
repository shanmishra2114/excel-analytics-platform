📊 Excel Analytics Platform

Transform your Excel data into beautiful 2D & 3D charts with ease.This platform allows users to upload Excel files, choose chart preferences, and instantly generate visual insights powered by AI.

🚀 Features

📂 Upload Excel files (.xlsx, .xls, .csv)
📈 Generate multiple types of charts (Bar, Line, Pie, Scatter, 3D, etc.)
⚡ AI-powered recommendations for chart selection
🔎 Interactive preview of charts
🔒 Secure authentication for users/admins
🌐 Deployed with Render


🛠️ Tech Stack

Frontend: React + Vite + TailwindCSS
Backend: Node.js + Express
Database: MongoDB (via Mongoose)
Deployment: Render


📂 Project Structure
excel-analytics-platform/
├── frontend/        # React + Vite client
├── server/          # Node.js + Express backend
├── public/          # Static assets
├── README.md        # Project documentation


⚡ Installation & Setup
Follow these steps to set up the project locally:
# 1. Clone the repository
git clone https://github.com/shanmishra2114/excel-analytics-platform.git
cd excel-analytics-platform

# 2. Install dependencies

## Frontend
cd frontend
npm install
npm run dev

## Backend
cd ../server
npm install
npm run dev

# 3. Setup environment variables
# Create a .env file inside the server directory with:
# MONGO_URI=<your-mongodb-uri>
# JWT_SECRET=<your-secret-key>


📦 Deployment

Frontend: Hosted on Render
Backend: Hosted on Render
Database: MongoDB Atlas

