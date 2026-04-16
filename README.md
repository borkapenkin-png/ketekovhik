# KETE Kohvik

KETE Kohviku veeb ja admin, jagatud eraldi `frontend/` ja `backend/` rakenduseks.

## Oluline enne deployd

- Admini algparool ei ole enam repo sees. Sea see serveris `ADMIN_INITIAL_PASSWORD` env kaudu.
- `JWT_SECRET` peab productionis olema eraldi tugev väärtus.
- `CORS_ALLOWED_ORIGINS` peab sisaldama ainult `ketekohvik.ee` domeene.
- `laskenta` peab jooksma eraldi service nime, pordi ja Nginxi server blocki all.

## Kohalik käivitus

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
yarn install
yarn start
```

## Deploy

Naidiskonfiguratsioonid on kaustas `deploy/`:

- `deploy/ketekohvik-backend.service`
- `deploy/ketekohvik-frontend.service`
- `deploy/nginx.ketekohvik.conf`

Need on tehtud nii, et `ketekohvik` ja `laskenta` oleksid serveris teadlikult lahus.
