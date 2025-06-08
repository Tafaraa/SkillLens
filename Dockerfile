# --- Frontend build stage ---
FROM node:18 AS frontend-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client .
RUN npm run build

# --- Backend build stage ---
FROM python:3.11-slim AS backend-build
WORKDIR /app/server
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server .

# --- Final stage ---
FROM python:3.11-slim
WORKDIR /app
# Copy backend
COPY --from=backend-build /app/server /app/server
# Copy frontend build
COPY --from=frontend-build /app/client/dist /app/server/static
# Install dependencies
COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt
EXPOSE 8000
ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"] 