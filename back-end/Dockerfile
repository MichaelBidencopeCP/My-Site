
FROM python:3.9.7-slim-buster as build

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

FROM build as dev
COPY . .
CMD ["fastapi","dev", "api/main.py", "--reload", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 8000

FROM build as prod
COPY . .
CMD ["fastapi", "run", "api/main.py", "--port", "8000"]
EXPOSE 8000