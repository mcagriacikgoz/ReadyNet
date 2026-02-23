# 🚀 Readynet created by Çağrı Açıkgöz
### Production-Ready URL Shortener Microservice

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Readynet**, a high-performance URL shortening service developed using modern backend architecture principles (Worker Pattern, Caching, Containerization). It is not just a URL shortener, but a concept project focused on asynchronous task management and scalability.

---

## 🧱 Architecture & Flow

**Client** → **API** → **Redis (Cache + Queue)** → **Worker** → **PostgreSQL**

The project adopts an **Event-driven** approach to reduce the load on the API:
- **API (Express):** Writes the URL creation process to PostgreSQL and caches redirects in Redis.
- **Redis:** Serves as both a **Cache** for fast routing and a **Message Queue** for click data.
- **Worker:** Consumes click events in the queue asynchronously and processes them in PostgreSQL.

---

## ✨ Features

- 🚀 **High Performance:** Millisecond-level routing with Redis caching.
- ⚙️ **Asynchronous Processing:** Click statistics are processed in the background without overloading the API.
- 🛡️ **Resilience:** Uninterrupted operation with Docker restart policies and health checks.
- 📦 **Modern DevOps:** Optimized image sizes with a multi-stage Docker build structure.

---

## 🚀 Run Locally

### Prerequisites
- Docker & Docker Compose must be installed.

### Installation
To get the project up and running with all its dependencies (Database, Cache, API, Worker):

```bash
docker compose up --build -d
```

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | The service checks the health status. |
| **POST** | `/shorten` | Creates a new short link. |
| **GET** | `/r/:code` | It redirects to the original URL. |
| **GET** | `/stats/:code` | Bağlantının tıklama istatistiklerini alır. |

Request Body (POST /shorten):
{
  "url": "[https://example.com](https://example.com)"
}

📂 Project Structure
```text
Readynet/
├── api/             # Express API service logic & Dockerfile
├── worker/          # Background worker service logic & Dockerfile
├── docker-compose.yml
└── README.md
```

## 🎯 Why This Project?

This project was developed to demonstrate the following backend patterns in practice:

Microservice Separation: Decoupling workloads.

Caching Strategies: Reducing database costs.

Message Queuing: Managing background tasks.


## 👤 Author
Çağrı Açıkgöz 
[My LinkedIn Profile](https://www.linkedin.com/in/cagriack/)
