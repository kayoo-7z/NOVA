# NOVA Project Context

## Project Overview
NOVA is an AI-powered child growth monitoring web application focused on early stunting risk detection and nutritional monitoring for children in Indonesia.

## Current Goal
Deliver a working MVP for capstone/demo within less than 2 weeks remaining.

## MVP Scope
- User authentication
- Child profile management
- Height/weight input
- Stunting risk prediction
- Basic dashboard and history

## Tech Stack
Frontend:
- React + Vite

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL

AI Service:
- FastAPI
- TensorFlow .h5 model

Deployment:
- Vercel (frontend)
- Render/Railway (backend + AI)
- Neon/Supabase PostgreSQL

## Architecture
Frontend → Express Backend → FastAPI AI Service → TensorFlow Model

The frontend must NEVER call the AI service directly.

## Important Constraints
- Remaining development time is less than 2 weeks
- Prioritize MVP and demo stability over advanced features
- Avoid overengineering and unnecessary refactors
- Focus on integration and working user flow

## Out of Scope (for MVP)
- Computer Vision body measurement
- MediaPipe
- Mobile app
- Complex analytics
- Advanced AI recommendations

## Current Development Priorities
1. Stable architecture
2. Backend + database integration
3. FastAPI inference service
4. Frontend integration
5. Deployment and demo readiness

## Branding / UI Direction
Color Palette:
- Burgundy (#6C0820)
- Cherry Blossom Pink (#F2AEBC)
- Misty Rose (#F2DCDB)
- Soft Cream (#FFFBEB)
- Silver Lake Blue (#5A86CB)
- Lapis Lazuli (#3D5D91)

UI Principles:
- Calm
- Professional
- Parent-friendly
- Trustworthy
- Emotionally safe