# Time Manager README

## 🧩 Project Description
This application allows company employees to **manage their working hours** (check-ins and check-outs), while enabling managers to **supervise their teams**, **analyze working time**, and **track key performance indicators (KPIs)**.  

This project is a full-stack web application built with **Django & Django REST Framework** for the backend, and **React** for the frontend.  
It also integrates a **DevOps dimension** through the use of **Docker**, **automated testing**, and a **CI/CD pipeline powered by GitHub Actions**.

---

## ⚙️ Technical Specifications
- **Backend**: Django + Django REST Framework (Python 3.11)
- **Frontend**: React (Node 18+)
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

---

## 🚀 How to Launch the Project

### On local with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/EpitechMscProPromo2027/T-DEV-700-project-COT_5.git
   cd T-DEV-700-project-COT_5.git
    ```

2. **Launch all services**
    ```bash
    docker compose up --build
    ```

3. **Access the app**
- Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
