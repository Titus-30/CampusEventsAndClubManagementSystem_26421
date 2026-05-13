# PHASE 4: SOFTWARE TEST PLAN

## i. Test Plan Overview

### 1. Objective
The objective of this test plan is to ensure that the **Campus Events & Club Management System** meets its functional requirements, provides a secure environment for user data, and offers a smooth user experience for the AUCA community.

### 2. Scope
Testing will cover all core modules:
-   User Authentication and Profile Management.
-   Club Creation, Approval, and Membership Management.
-   Event Creation and Attendance Tracking.
-   Location Hierarchies and Announcements.

---

### 3. Roles and Responsibilities
| Role | Responsibility |
| :--- | :--- |
| **Lead Developer (Student)** | Writing unit tests, integration tests, and fixing bugs. |
| **QA Tester (Student)** | Executing manual UI tests and validating API endpoints. |
| **Project Supervisor** | Reviewing test results and ensuring requirement compliance. |

---

### 4. Testing Schedule
| Phase | Duration | Activity |
| :--- | :--- | :--- |
| **Phase A** | 2 Days | Unit Testing for Service and Repository layers. |
| **Phase B** | 1 Day | Integration Testing for REST Controllers. |
| **Phase C** | 2 Days | Manual UI Testing and User Acceptance Testing (UAT). |
| **Phase D** | 1 Day | Final Bug Fixing and Regression Testing. |

---

## ii. Test Strategy

### 1. Unit Testing
-   **Focus**: Testing individual methods and classes in isolation.
-   **Tools**: JUnit 5, Mockito.
-   **Example**: Verifying that `ClubService.approveClub()` correctly updates the status to `APPROVED`.

### 2. Integration Testing
-   **Focus**: Testing the interaction between different layers (Controller -> Service -> Repository).
-   **Tools**: Spring Boot Test, H2 (In-memory database).
-   **Example**: Testing the `/api/user/register` endpoint to ensure data is correctly persisted in the database.

### 3. API Testing (Functional)
-   **Focus**: Validating REST endpoints against expected inputs and outputs.
-   **Tools**: Postman (as seen in screenshots), Curl.
-   **Example**: Sending a JSON request to create a club and checking for a `201 Created` status.

### 4. User Interface (UI) Testing
-   **Focus**: Ensuring the React frontend correctly displays data and handles user interactions.
-   **Tools**: Manual Browser Testing.
-   **Example**: Clicking the "Join Club" button and verifying the UI reflects the new membership status.

### 5. User Acceptance Testing (UAT)
-   **Focus**: Ensuring the system meets the actual needs of AUCA students and admins.
-   **Scenario**: A student user successfully proposes a club, and an admin user approves it.

---

## iii. Software Test Cases

| Test ID | Feature | Test Case Description | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-01 | Auth | Register a new user with valid details. | User created, success message returned. |
| TC-02 | Auth | Register a user with an existing email. | Error message: "Email already exists". |
| TC-03 | Auth | Login with incorrect password. | Error message: "Invalid email or password". |
| TC-04 | Club | Student submits a club proposal. | Club created with status `PENDING`. |
| TC-05 | Club | Admin approves a pending club. | Club status updated to `APPROVED`. |
| TC-06 | Event | Organizer creates event with end date before start date. | System prevents creation/shows error. |
| TC-07 | Event | Organizer creates a new event. | Event added; notification sent to all users. |
| TC-08 | Attendance | Student marks "Going" for an event. | Attendance record saved; "Going" count increases. |
| TC-09 | Search | Search for users by district. | List of users in that district is displayed. |
| TC-10 | Location | Add a new village under a specific cell. | Location hierarchy updated correctly. |
| TC-11 | Security | Access admin dashboard as a Student. | System redirects or shows "Access Denied". |

---

## iv. Test Environment
-   **OS**: Windows (Development), Alpine Linux (Docker Containers).
-   **Language**: Java 21, JavaScript (Node 20).
-   **Database**: PostgreSQL 14.
-   **Testing Tools**: JUnit 5, Mockito, Postman.

---

## v. Tools for Tracking Issues

| Tool | Purpose |
| :--- | :--- |
| **GitHub Issues** | Primary tool for logging, tracking, and resolving bugs and feature requests. Each issue is labeled (e.g., `bug`, `enhancement`) and linked to a commit or pull request for full traceability. |
| **Git Commit Messages** | Serve as a secondary log — each fix is prefixed with `fix:`, `feat:`, or `refactor:` following Conventional Commits standard, making it easy to trace what was changed and why. |
| **Console & Application Logs** | Spring Boot logs (`System.err.println`, exception stack traces) are used during development to identify runtime errors in service and repository layers. |

### GitHub Issues Workflow:
1. A bug or failed test case is identified.
2. An Issue is created on GitHub with a descriptive title and steps to reproduce.
3. The fix is implemented in a feature branch.
4. The branch is merged into `main` with a commit referencing the issue (e.g., `fix: resolve club approval notification bug`).
5. The Issue is closed automatically upon merge.

---

## vi. Test Execution Summary (Current Status)

The test plan was executed on **May 13, 2026**. All automated and manual tests have been successfully verified.

### 1. Automated Unit Tests (JUnit 5)
| Module | Tests Run | Passed | Failed |
| :--- | :--- | :--- | :--- |
| **UserService** | 4 | 4 | 0 |
| **ClubService** | 3 | 3 | 0 |
| **EventService** | 3 | 3 | 0 |
| **LocationService** | 3 | 3 | 0 |
| **Other Services** | 17 | 17 | 0 |
| **TOTAL** | **30** | **30** | **0** |

**Result**: ✅ **BUILD SUCCESS**

### 2. Manual UI/UX Verification
-   **Navigation**: All links between Dashboard, Events, and Clubs are functional.
-   **Forms**: Input validation (Required fields, Email format) is working on Login/Signup.
-   **Responsive Design**: UI layouts remain consistent on different screen sizes (Sidebar collapses).
-   **Real-time Updates**: Notifications appear immediately upon club approval and event creation.

**Conclusion**: The system is stable and meets all functional requirements defined in Phase 1.
