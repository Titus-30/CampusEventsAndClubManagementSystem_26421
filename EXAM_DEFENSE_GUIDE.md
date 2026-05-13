# 🎓 EXAM DEFENSE GUIDE: Campus Events & Club Management System
**Course:** SENG 8240 — Best Programming Practices and Design Patterns  
**Instructor:** Rutarindwa Jean Pierre

---

## PHASE 1: System Analysis & Design

### 1. Topic and Case Study formulation
*   **What to say**: "My project is the 'Campus Events & Club Management System', using the **Adventist University of Central Africa (AUCA)** as the case study. It focuses on centralizing student activities across the Masoro and Gishushu campuses."
*   **What to show**: `PHASE_1_DOCUMENTATION.md` → Section **i. Case Study**.

### 2. Functional Diagram (Internal working)
*   **What to say**: "The functional diagram illustrates how a student's club proposal moves from the Dean of Students to the System Admin for final approval, and then broadcasted to the student body."
*   **What to show**: `PHASE_1_DOCUMENTATION.md` → Section **ii. Functional Diagram** (Mermaid graph).

### 3. Problem Statement
*   **What to say**: "AUCA faced four main challenges: fragmented communication (informal posters), manual paper-based registration, difficulty coordinating between two campuses, and a lack of administrative transparency."
*   **What to show**: `PHASE_1_DOCUMENTATION.md` → Section **iii. Problem Statement**.

### 4. OO Analysis Diagrams (UML)
*   **What to say**: "I used 5 standard UML diagrams to model the system: **Use Case** (user interactions), **Class** (data structure), **Activity** (approval workflow), **Sequence** (event registration process), and **Component** (high-level architecture)."
*   **What to show**: Scroll through the 5 diagrams in `PHASE_1_DOCUMENTATION.md`.

---

## PHASE 2: Prototype, Best Practices & Patterns

### 1. Software Development Prototype
*   **What to say**: "The prototype is a full-stack application with a React frontend and Spring Boot backend. It handles role-based dashboards, event RSVP workflows, and administrative club approvals."
*   **What to show**: 
    -   **Screens/Layout**: Open the browser and show the Dashboard/Sidebar.
    -   **Input Processing**: Show the Login form or the Event Search bar.
    -   **User Journeys**: Demonstrate: *Login → Go to Clubs → Click 'Join' → Logout.*

### 2. Software Programming Best Practices
*   **What to say**: "I strictly followed Google Coding Standards. I used **meaningful naming** (e.g., `EventAttendanceService`), **proper indentation** (4-spaces), and the **Single Responsibility Principle**—each class handles exactly one task."
*   **What to show**: 
    -   **Naming**: Open `UserService.java`.
    -   **Responsibility**: Show the separate `controller`, `service`, and `repository` folders.
    -   **Comments**: Show `ClubService.java` (clean, purposeful comments).

### 3. Software Design Patterns
*   **What to say**: "I implemented 5 patterns: **MVC** (Architecture), **Repository** (Data Access), **Singleton** (Spring Services), **Observer** (Notification broadcast on club approval), and **Dependency Injection** (`@Autowired`)."
*   **What to show**: 
    -   Point to the `@Repository` and `@Service` annotations.
    -   Show the `NotificationService` call inside `ClubService.approveClub()`.

---

## PHASE 3: Dockerization & Version Control

### 1. Dockerization (Packaging)
*   **What to say**: "The app is containerized using **Docker Compose**. I used **multi-stage builds** for the backend and frontend to minimize image size and maximize security."
*   **What to show**: 
    -   `docker-compose.yml` (shows the db, backend, and frontend services).
    -   `backend/Dockerfile` (show the 'Builder' and 'Runtime' stages).

### 2. Version Control System (VCS)
*   **What to say**: "I used **Git** for version control, linked to a remote **GitHub** repository. The environment is optimized with a `.gitignore` file to ensure only source code is tracked, not temporary build files."
*   **What to show**: 
    -   `git remote -v` in terminal.
    -   `PHASE_3_DOCUMENTATION.md` → **Section iii. Commit History Log**.
    -   The `.gitignore` file in the root directory.

---

## PHASE 4: Software Test Plan

### 1. Testing Goals & Alignment
*   **What to say**: "The goal is to ensure 100% reliability of AUCA's core functions (Auth, Clubs, Events). This aligns with the system requirements by verifying every business rule we defined in Phase 1."
*   **What to show**: `PHASE_4_DOCUMENTATION.md` → **Section i.1 (Objective)**.

### 2. Features and Test Cases
*   **What to say**: "I have 11 manual test cases covering success, failure, and security scenarios. In the code, I have **30 automated unit tests** using JUnit 5 and Mockito."
*   **What to show**: 
    -   The **Software Test Cases table** in `PHASE_4_DOCUMENTATION.md`.
    -   Run `mvn test` in the terminal to show **BUILD SUCCESS**.

### 3. Tools for Tracking Issues
*   **What to say**: "I use **GitHub Issues** for logging bugs and **Conventional Commits** (e.g., `fix:`, `feat:`) to maintain a professional audit trail of all changes."
*   **What to show**: `PHASE_4_DOCUMENTATION.md` → **Section v. Tools for Tracking Issues**.

---

### 🛡️ Final Security Bonus (The "A+" Answer)
If the instructor asks about security, say: *"I implemented **BCrypt password hashing**. We never store passwords in plaintext; we store secure 1-way hashes, following industry best practices for student data protection."*
