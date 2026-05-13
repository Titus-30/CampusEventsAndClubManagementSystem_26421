# PHASE 3: DOCKERIZATION AND VERSION CONTROL

## i. Dockerization Process

### 1. Understanding Dockerization
Dockerizing a software application involves packaging the application and all its dependencies (libraries, runtime, OS packages) into a single, portable unit called a **container**. This ensures that the application runs consistently across different environments (development, testing, production) by isolating it from its surroundings.

### 2. Process for the Campus Events System
The dockerization of this application was performed in two main steps:

#### Step A: Backend Dockerization (Spring Boot)
A `Dockerfile` was created in the `backend/` directory using a **multi-stage build** to optimize the image size:
1.  **Builder Stage**: Uses `maven:3.9-eclipse-temurin-21-alpine` to compile the Java code and package it into an executable JAR file.
2.  **Runtime Stage**: Uses a slim `eclipse-temurin:21-jre-alpine` image to run the generated JAR. This reduces the final image size and improves security.

#### Step B: Frontend Dockerization (React/Vite)
A `Dockerfile` was created in the `frontend/` directory:
1.  Uses `node:20-alpine` to build the static assets.
2.  Uses `nginx:alpine` to serve the static files, providing a high-performance web server.

#### Step C: Orchestration with Docker Compose
A `docker-compose.yml` file was created in the root directory to manage the multi-container setup:
-   **db**: Runs a PostgreSQL 14 database.
-   **backend**: Builds and runs the Spring Boot app, depending on the database.
-   **frontend**: Builds and runs the React app, depending on the backend.

### 3. Running the Dockerized Application
To run the entire system, use the following command:
```bash
docker-compose up --build
```

---

## ii. Version Control System (VCS) Implementation

### 1. Configuration
For this project, **Git** was chosen as the **Version Control System (VCS) of Choice**. It serves as the secure repository for tracking and managing all changes to the software code, satisfying the requirement for a professional VCS implementation.

### 2. Implementation Steps:
1.  **Initialization**: The repository was initialized using `git init`.
2.  **Configuration**: User identity was set:
    ```bash
    git config --global user.name "Titus Mucyo"
    git config --global user.email "titusmucyo693@gmail.com"
    ```
3.  **Ignoring Files**: A `.gitignore` file was created to prevent unnecessary files (like `node_modules`, `target/`, `.env`) from being tracked.
4.  **Branching Strategy**: Used a main branch for stable code and feature branches for incremental development.
5.  **Remote Repository**: The local repository was linked to GitHub for remote storage and version tracking:
    -   Repository URL: `https://github.com/Titus-30/CampusEventsAndClubManagementSystem_26421.git`

### 3. Benefits Captured:
-   **Traceability**: Every feature addition is captured with a meaningful commit message.
-   **Safety**: Previous versions of the code can be easily restored if a bug is introduced.
-   **Collaboration**: Multiple contributors can work on different features simultaneously using branches.

---

## iii. Commit History Log

The following is the actual commit log from the project repository, demonstrating structured, incremental development captured throughout all four phases:

```
Commit Hash  | Message
-------------|----------------------------------------------------------
064f9e1      | feat: implement BCrypt password hashing for registration, login, and password reset
1948801      | refactor: remove verbose deliberation comments in ClubService
c2e8644      | fix: correct Mermaid diagram syntax for Use Case and Component diagrams
a08b0c9      | Update README.md
fd13931      | Phase 4: Software Test Plan and Quality Assurance
eb47fe5      | Phase 3: Dockerization and Version Control System Setup
440c5bb      | Phase 2: Prototype and Design Patterns Implementation
c7c2ba4      | Phase 1: System Analysis and Design - Case Study: AUCA
7030e75      | System: Initialize project structure and Docker orchestration
574f8f5      | Create README for Campus Events & Club Management System
```

Each commit corresponds to a distinct development phase, demonstrating a clean, logical progression from project initialization through system analysis, prototyping, dockerization, and testing. This history was generated using:

```bash
git log --oneline
```

Remote Repository: `https://github.com/Titus-30/CampusEventsAndClubManagementSystem_26421.git`
