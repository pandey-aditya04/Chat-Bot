# ChatBot Builder SaaS

A premium, interactive platform for building and managing AI-powered chatbots. Built with React, Vite, Express, and MongoDB.

## Features
- **3D Interactive Hero**: Immersive 3D robot character tracking cursor movements.
- **Bento Grid Dashboard**: Modern, glass-morphism design for bot management.
- **Real-time Analytics**: Track conversations and user engagement.
- **FAQ Management**: Easily configure bot responses with a structured FAQ system.
- **Serverless Backend**: Optimized for Vercel deployment with MongoDB persistence.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Three.js, GSAP, Framer Motion.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB (Atlas recommended for production).
- **Deployment**: Vercel.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install` (at the root).
3. Configure `.env` with your `MONGODB_URI`.
4. Seed the database: `node server/seed.js`.
5. Run locally: `npm run dev` (for frontend) and `node server/index.js` (for backend).

## Deployment
This project is configured for Vercel. Simply connect your GitHub repository to Vercel and set your environment variables.
