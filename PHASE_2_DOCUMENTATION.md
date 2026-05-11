# PHASE 2: PROTOTYPE AND DESIGN PATTERNS

## i. Software Development Prototype Summary

The **Campus Events & Club Management System** has been developed as a fully functional software prototype. This early version of the application serves to:
-   **Test Core Concepts**: Validating the feasibility of centralizing AUCA club and event management.
-   **Gather Feedback**: Providing a tangible interface for student and administrative users to interact with.
-   **Refine Functionality**: Identifying early design flaws, such as complex location hierarchies or approval workflows, before final deployment.

The prototype includes a robust **Spring Boot backend** providing a RESTful API and a **Vite/React frontend** for a dynamic user experience.

---

## ii. Coding Standards and Best Practices

The development of this software strictly adheres to **Google Coding Standards** to ensure code readability, maintainability, and consistency.

### Google Java Style Guide Implementation:
1.  **Naming Conventions**: 
    -   Classes: `PascalCase` (e.g., `ClubController`, `EventService`).
    -   Methods and Variables: `camelCase` (e.g., `approveClub`, `clubRepository`).
    -   Constants: `UPPER_SNAKE_CASE` (e.g., `PENDING`, `APPROVED`).
2.  **Formatting**:
    -   Used 4-space indentation for code blocks.
    -   Braces follow the K&R style (opening brace on the same line).
    -   Limited line length to improve readability on various screen sizes.
3.  **Packages**: Logical organization of classes into `controller`, `service`, `model`, and `repository` packages.

### Google JavaScript Style Guide Implementation (Frontend):
-   Used `const` and `let` instead of `var`.
-   Arrow functions used for component definitions and event handlers.
-   Clear separation of styles (CSS) and logic (JSX).

---

## iii. Software Design Patterns

The application leverages several industry-standard design patterns to achieve a clean and scalable architecture.

### 1. Model-View-Controller (MVC) Pattern
The core architectural pattern of the application.
-   **Model**: Represents the data and business logic (e.g., `User`, `Club`, `Event` entities).
-   **View**: The React-based frontend that renders the user interface.
-   **Controller**: Handles incoming HTTP requests and coordinates between the View and the Model (e.g., `ClubController`).

### 2. Repository Pattern
Used to mediate between the domain and data mapping layers.
-   **Implementation**: `ClubRepository`, `UserRepository`, etc.
-   **Benefit**: Decouples the business logic from the underlying data access technology (Spring Data JPA), making it easier to switch databases or mock data for testing.

### 3. Singleton Pattern
Spring Boot manages most components as Singletons by default.
-   **Implementation**: Every `@Service` (e.g., `ClubService`) and `@Controller` is instantiated once and shared across the application.
-   **Benefit**: Ensures efficient memory usage and centralized state management for services.

### 4. Observer Pattern
Used for the notification system within the application.
-   **Implementation**: When a club is approved in `ClubService`, the `NotificationService` acts as a notifier to broadcast updates to all relevant users.
-   **Benefit**: Allows for loose coupling between the event source (Club creation/approval) and the actions taken (sending notifications).

### 5. Dependency Injection (Inversion of Control)
While technically a principle, it is implemented as a pattern in Spring.
-   **Implementation**: Using `@Autowired` to inject repositories into services and services into controllers.
-   **Benefit**: Improves testability by allowing dependencies to be easily mocked.
