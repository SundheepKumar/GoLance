GoLance
Campus freelancing platform — frontend in React + Bootstrap, backend in Spring Boot.
--------------------------------------------------------------------------------
Project Structure
GoLance/
├── frontend/   # React app (Bootstrap + plain CSS)

├── backend/    # Spring Boot app (Maven)

├── .gitignore

└── README.md

--------------------------------------------------------------------------------
Getting Started (Local Development)

1. Clone the repo

git clone https://github.com/SundheepKumar/GoLance.git

cd GoLance

2. Frontend Setup

cd frontend

npm install

npm run dev

Runs at: http://localhost:5173 (Vite default)


Edit .env in frontend/ to set your backend API URL:

VITE_API_URL=http://localhost:8080/api

3. Backend Setup

cd backend

./mvnw spring-boot:run

Runs at: http://localhost:8080


Edit application.properties in backend/src/main/resources/:


properties

spring.datasource.url=jdbc:mysql://localhost:3306/golance
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

--------------------------------------------------------------------------------

Team Git Workflow

Branches

main → stable, production-ready

dev → integration branch for all features

feature/<desc> → feature-specific branches (frontend or backend)

Examples:

feature/frontend-task-list
feature/backend-auth-api
Flow

--------------------------------------------------------------------------------
Before starting work:


git checkout dev
git pull origin dev
git checkout -b feature/<desc>
Work on your changes → commit

Push your branch:

git push -u origin feature/<desc>
Open a Pull Request into dev on GitHub

At least 1 review before merge

Periodically merge dev → main for releases

--------------------------------------------------------------------------------

Contribution Rules
Never commit directly to main

Keep commits small and meaningful

Write clear PR titles & descriptions

Resolve merge conflicts locally before pushing

