GoLance
Campus freelancing platform — frontend in React + Bootstrap, backend in Spring Boot.

Project Structure
bash
Copy
Edit
GoLance/
├── frontend/   # React app (Bootstrap + plain CSS)
├── backend/    # Spring Boot app (Maven)
├── .gitignore
└── README.md

Getting Started (Local Development)

1. Clone the repo
bash
Copy
Edit
git clone https://github.com/YOUR_USERNAME/GoLance.git
cd GoLance

2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Runs at: http://localhost:5173 (Vite default)

Edit .env in frontend/ to set your backend API URL:

bash
Copy
Edit
VITE_API_URL=http://localhost:8080/api

3. Backend Setup
bash
Copy
Edit
cd backend
./mvnw spring-boot:run
Runs at: http://localhost:8080

Edit application.properties in backend/src/main/resources/:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://localhost:3306/golance
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update


Team Git Workflow
Branches
main → stable, production-ready

dev → integration branch for all features

feature/<desc> → feature-specific branches (frontend or backend)

Examples:

bash
Copy
Edit
feature/frontend-task-list
feature/backend-auth-api
Flow
Before starting work:

bash
Copy
Edit
git checkout dev
git pull origin dev
git checkout -b feature/<desc>
Work on your changes → commit

Push your branch:

bash
Copy
Edit
git push -u origin feature/<desc>
Open a Pull Request into dev on GitHub

At least 1 review before merge

Periodically merge dev → main for releases




✅ Contribution Rules
Never commit directly to main

Keep commits small and meaningful

Write clear PR titles & descriptions

Resolve merge conflicts locally before pushing

