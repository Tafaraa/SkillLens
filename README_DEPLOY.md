# Deployment Guide: SkillLens

This guide provides detailed instructions for deploying SkillLens on Render (backend) and Vercel (frontend).

## Prerequisites
- A GitHub account
- A Render account (render.com)
- A Vercel account (vercel.com)
- Git installed on your local machine
- Node.js and npm installed (for local testing)

## Deploying the Backend on Render

1. **Prepare Your Repository**
   - Ensure your code is pushed to a GitHub repository
   - Make sure all environment variables are properly configured in your `.env` file
   - Verify that `requirements.txt` and `Procfile` are present in the `server` directory

2. **Render Setup**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your SkillLens project

3. **Configure Render Service**
   - Name: `skilllens-backend` (or your preferred name)
   - Environment: `Python 3`
   - Region: Choose the closest to your users
   - Branch: `main` (or your default branch)
   - Root Directory: `server`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Choose appropriate plan (Free tier available for testing)

4. **Environment Variables**
   Add the following environment variables in Render:
   ```
   DATABASE_URL=your_database_url
   SECRET_KEY=Qw8k2n3lKJH8sdf9sdf8sdf9sdf8sdf9sdf8sdf9sdf8sdf9
   CORS_ORIGINS=https://skill-lens.vercel.app/
   PYTHON_VERSION=3.10.0
   ```

5. **Deploy Backend**
   - Click "Create Web Service"
   - Render will automatically:
     - Clone your repository
     - Install dependencies
     - Build your application
     - Start the server
   - Note down the generated domain (e.g., `https://skilllens.onrender.com`)

## Deploying the Frontend on Vercel

1. **Prepare Frontend Code**
   - Ensure your frontend code is in the `client` directory
   - Update the API base URL in your frontend code to point to your Render backend URL

2. **Vercel Setup**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Environment Variables**
   - Add the following environment variables in Vercel:
     ```
     VITE_API_URL=https://skilllens.onrender.com
     ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Once complete, you'll get a deployment URL (e.g., `https://skill-lens.vercel.app`)

## Post-Deployment Steps

1. **Update CORS Settings**
   - Go back to Render dashboard
   - Update the `CORS_ORIGINS` environment variable with your Vercel frontend URL
   - Redeploy the backend if necessary

2. **Verify Deployment**
   - Test the frontend application
   - Verify API calls are working
   - Check for any CORS issues
   - Test all main features

3. **Custom Domain (Optional)**
   - In Vercel:
     - Go to Project Settings > Domains
     - Add your custom domain
     - Follow the DNS configuration instructions
   - In Render:
     - Go to your web service settings
     - Click "Custom Domain"
     - Add your custom domain
     - Configure DNS settings as instructed

## Troubleshooting

1. **Common Issues**
   - CORS errors: Ensure CORS_ORIGINS includes your frontend URL
   - API connection issues: Verify the API URL in frontend environment variables
   - Build failures: Check build logs in both Render and Vercel
   - Render free tier sleep: Note that the free tier will sleep after 15 minutes of inactivity

2. **Logs and Monitoring**
   - Render: View logs in the Render dashboard under your service
   - Vercel: Check deployment logs in the Vercel dashboard
   - Use the respective platforms' monitoring tools to track performance

## Maintenance

1. **Updates and Deployments**
   - Push changes to your GitHub repository
   - Both Render and Vercel will automatically deploy updates
   - Monitor deployment logs for any issues

2. **Scaling**
   - Render: Upgrade your plan in the Render dashboard
   - Vercel: Configure scaling options in project settings

## Support and Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Vite Documentation](https://vitejs.dev/guide)

---
For additional help or custom configurations, refer to the official documentation of both platforms.

## Vercel (Frontend)
- The frontend is built with Vite (React) in `/client`.
- Add a `vercel.json` file in `/client` (already provided) to handle rewrites and static serving.
- Set up your Vercel project to use `/client` as the root.
- Build command: `npm run build`
- Output directory: `dist`
- API requests to `/api/*` are proxied to the backend.

## Render (Backend)
- The backend is FastAPI in `/server`.
- Use the provided `Dockerfile` at the project root for full-stack deployment.
- Or, deploy `/server` as a Python service with the provided `Procfile`.
- Render will detect the `web:` entry and run Uvicorn.
- Expose port `8000`.

## Docker (Full Stack)
- The provided `Dockerfile` builds both frontend and backend.
- The final image serves the frontend as static files and runs FastAPI with Uvicorn.
- Build: `docker build -t skilllens .`
- Run: `docker run -p 8000:8000 skilllens`

## Environment Variables
- Set any required environment variables for your backend (e.g., database URLs, secrets) in Render or as Docker envs.

## Project Structure
- `/client` - Vite/React frontend
- `/server` - FastAPI backend
- `Dockerfile` - Multi-stage build for full-stack deploy
- `client/vercel.json` - Vercel config
- `server/Procfile` - Render config

---
For custom domains, SSL, or advanced routing, refer to Vercel and Render docs.

- **Frontend URL:** https://skill-lens.vercel.app/
- **Backend URL:** https://skilllens.onrender.com 