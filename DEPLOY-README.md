## Setup
1) `cp frontend/.env.example frontend/.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_BASE`
2) `cp backend/.env.example backend/.env` and fill:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `CORS_ALLOWED_ORIGINS`
3) Run backend: `cd backend && ./mvnw spring-boot:run`
4) Run frontend: `cd frontend && npm i && npm run dev`

## Prereqs
- Node 18+ / npm, Java 21, Git
- gcloud CLI logged in and project set:
  `gcloud auth login && gcloud config set project neonsquare-project-2025`
- Enable APIs once: `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`

## Deploys
- **Backend (Cloud Run, region: australia-southeast1)**  
  **Option A (two-step):**
  `cd backend && gcloud builds submit --tag gcr.io/neonsquare-project-2025/neonsquare-backend:v1`  
  `gcloud run deploy neonsquare-backend --image gcr.io/neonsquare-project-2025/neonsquare-backend:v1 --region australia-southeast1 --allow-unauthenticated --env-vars-file env.yaml`

  **Option B (one command):**  
  `gcloud run deploy neonsquare-backend --source ./backend --region australia-southeast1 --allow-unauthenticated --env-vars-file ./backend/env.yaml`

- **Frontend (Vercel)**
  Set envs (Preview + Production): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE`  
  Deploy: `npx vercel deploy --prod`

## Links (public)
- **GCP Project ID:** `neonsquare-project-2025`
- **GCP Region:** `australia-southeast1`
- **Cloud Run (backend):** https://neonsquare-backend-2ko7mhy5la-ts.a.run.app
- **Vercel (frontend):** https://neonsquare-pqysyzg32-duy-nguyens-projects-702005ab.vercel.app
- **Supabase Project URL:** https://vejapunmvtuixzhgtifg.supabase.co

> ⚠️ Never commit real secrets. Keep `.env`, `.env.local`, and `backend/env.yaml` **out of git**. Use the `*.example` files as templates only.
