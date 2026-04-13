# Task Tracker CI/CD Demo

Bu proje, GitHub + Jenkins + Docker ile basit bir CI/CD akisini gostermek icin hazirlanmis full-stack bir gorev ve not takip uygulamasidir.

Backend Spring Boot ile, frontend React + Vite ile gelistirildi. Veritabani yoktur; backend baslangicta bellek icinde ornek gorevler olusturur.

## Klasor Yapisi

```text
cicd-odev/
  backend/
  frontend/
  Dockerfile.backend
  Dockerfile.frontend
  docker-compose.yml
  Jenkinsfile
  README.md
```

## Backend Local Calistirma

```bat
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8082
```

Kontrol endpointleri:

```text
GET http://localhost:8082/
GET http://localhost:8082/api/status
GET http://localhost:8082/api/tasks
```

## Frontend Local Calistirma

```bat
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

Local calismada Vite proxy, `/api` isteklerini `http://localhost:8082` adresindeki backend servisine yonlendirir.

## Docker ile Calistirma

Kok dizinde:

```bat
docker compose up -d --build
```

Container durumunu gormek icin:

```bat
docker compose ps
```

Docker URL'leri:

```text
Backend:  http://localhost:8082
Frontend: http://localhost:3000
```

Docker calismasinda frontend Nginx ile servis edilir. Nginx, `/api` isteklerini Docker Compose icindeki `backend:8082` servisine proxy eder.

## Jenkins Pipeline Ozeti

Jenkins URL:

```text
http://localhost:8080
```

Pipeline asamalari:

```text
Checkout
Build Backend
Build Frontend
Docker Build
Docker Deploy
Verify
```

Jenkins icinde Maven tool adi `M3` olmalidir. Frontend build asamasi once PATH icinde `npm` arar; npm yoksa Docker icindeki Node image ile ayni build komutlarini calistirir. Pipeline registry push, remote server deploy veya SSH kullanmaz; local makinede Docker Compose ile uygulamayi ayaga kaldirir.

## Uygulama URL'leri

```text
Jenkins:  http://localhost:8080
Backend:  http://localhost:8082
Frontend: http://localhost:3000
```
