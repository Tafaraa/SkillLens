# Deployment Guide: SkillLens

This guide provides detailed instructions for deploying SkillLens on Railway (backend) and Vercel (frontend).

## Prerequisites
- A GitHub account
- A Railway account (railway.app)
- A Vercel account (vercel.com)
- Git installed on your local machine
- Node.js and npm installed (for local testing)

## Deploying the Backend on Railway

1. **Prepare Your Repository**
   - Ensure your code is pushed to a GitHub repository
   - Make sure all environment variables are properly configured in your `.env` file

2. **Railway Setup**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SkillLens repository
   - Select the `server` directory as the deployment source

3. **Configure Railway Project**
   - In the Railway dashboard, go to your project settings
   - Add the following environment variables:
     ```
     DATABASE_URL=your_database_url
     SECRET_KEY=your_secret_key
     CORS_ORIGINS=https://your-frontend-domain.vercel.app
     ```
   - Set the start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Deploy Backend**
   - Railway will automatically detect the Python project
   - It will install dependencies from `requirements.txt`
   - The deployment will start automatically
   - Note down the generated domain (e.g., `https://your-app.railway.app`)

## Deploying the Frontend on Vercel

1. **Prepare Frontend Code**
   - Ensure your frontend code is in the `client` directory
   - Update the API base URL in your frontend code to point to your Railway backend URL

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
     VITE_API_URL=https://your-railway-backend-url
     ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Once complete, you'll get a deployment URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment Steps

1. **Update CORS Settings**
   - Go back to Railway dashboard
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
   - In Railway:
     - Go to Project Settings > Domains
     - Add your custom domain
     - Configure DNS settings as instructed

## Troubleshooting

1. **Common Issues**
   - CORS errors: Ensure CORS_ORIGINS includes your frontend URL
   - API connection issues: Verify the API URL in frontend environment variables
   - Build failures: Check build logs in both Railway and Vercel

2. **Logs and Monitoring**
   - Railway: View logs in the Railway dashboard
   - Vercel: Check deployment logs in the Vercel dashboard
   - Use the respective platforms' monitoring tools to track performance

## Maintenance

1. **Updates and Deployments**
   - Push changes to your GitHub repository
   - Both Railway and Vercel will automatically deploy updates
   - Monitor deployment logs for any issues

2. **Scaling**
   - Railway: Adjust resources in the Railway dashboard
   - Vercel: Configure scaling options in project settings

## Support and Resources

- [Railway Documentation](https://docs.railway.app)
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

## Railway (Backend)
- The backend is FastAPI in `/server`.
- Use the provided `Dockerfile` at the project root for full-stack deployment.
- Or, deploy `/server` as a Python service with the provided `Procfile`.
- Railway will detect the `web:` entry and run Uvicorn.
- Expose port `8000`.

## Docker (Full Stack)
- The provided `Dockerfile` builds both frontend and backend.
- The final image serves the frontend as static files and runs FastAPI with Uvicorn.
- Build: `docker build -t skilllens .`
- Run: `docker run -p 8000:8000 skilllens`

## Environment Variables
- Set any required environment variables for your backend (e.g., database URLs, secrets) in Railway or as Docker envs.

## Project Structure
- `/client` - Vite/React frontend
- `/server` - FastAPI backend
- `Dockerfile` - Multi-stage build for full-stack deploy
- `client/vercel.json` - Vercel config
- `server/Procfile` - Railway config

---
For custom domains, SSL, or advanced routing, refer to Vercel and Railway docs. 