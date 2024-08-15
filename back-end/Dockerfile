
FROM python:3.9.7-slim-buster

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN ls -la

EXPOSE 8000

CMD ["fastapi", "run", "main.py", "--port", "8000"]