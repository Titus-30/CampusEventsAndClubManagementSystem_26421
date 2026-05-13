# 🎓 Campus Events & Club Management System

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)
![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![JPA](https://img.shields.io/badge/JPA-Hibernate-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

*A comprehensive Spring Boot application for managing campus clubs, events, and student engagement*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Database Schema](#-database-schema)

</div>

---

### Name: IRIMASO MUCYO Titus

### Id: 26421

### Group: C

### Instructor: Jean Pierre RUTARINDWA

### Course: BEST PROGRAMMING PRACTICES AND DESIGN PATTERNS (SENG 8240)

## 📚 Final Exam Documentation (Phases 1-4)

This project is structured according to the final exam requirements, divided into four phases:

- **[PHASE 1: System Analysis and Design](PHASE_1_DOCUMENTATION.md)** - Case study (AUCA), Functional Diagrams, and UML Diagrams (Use Case, Class, Activity, Sequence, Component).
- **[PHASE 2: Prototype and Design Patterns](PHASE_2_DOCUMENTATION.md)** - Software prototype summary, Coding standards (Google Style), and Design patterns (MVC, Repository, etc.).
- **[PHASE 3: Dockerization and VCS](PHASE_3_DOCUMENTATION.md)** - Process to dockerize the application and Version Control System (Git) configuration.
- **[PHASE 4: Software Test Plan](PHASE_4_DOCUMENTATION.md)** - Detailed roadmap for testing activities and specific test cases.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Usage Examples](#-usage-examples)
- [Contributing](#-contributing)
- [License](#-license)


---

## 🌟 Overview

The *Campus Events & Club Management System* is a robust RESTful API built with Spring Boot that streamlines the management of student clubs, campus events, and user engagement at the **Adventist University of Central Africa (AUCA)**. The system provides comprehensive tools for club administration, event planning, attendance tracking, and location-based user management following Rwanda's administrative hierarchy.

### 🎯 Problem Statement

Campus organizations often struggle with:
- Fragmented event management processes
- Difficulty tracking club memberships and attendance
- Lack of centralized announcement systems
- Limited location-based user organization

This system solves these challenges by providing a unified platform for all campus activities.

---

## ✨ Features

### 👥 User Management
- ✅ Multi-role support (Student, Organizer, Admin)
- ✅ User registration with email and phone validation
- ✅ Profile management with bio and contact information
- ✅ Location-based user organization (Province, District, Sector, Cell, Village)
- ✅ Advanced search by email, phone, province, or district
- ✅ Pagination and sorting capabilities

### 🏢 Club Management
- ✅ Club creation with approval workflow (Pending → Approved/Rejected)
- ✅ Role-based auto-approval (Students require admin approval)
- ✅ Membership tracking with join/leave timestamps
- ✅ Club-specific announcements
- ✅ Filter clubs by status

### 📅 Event Management
- ✅ Comprehensive event creation with categories
- ✅ Venue and time management
- ✅ Event attendance tracking (Going, Not Going, Maybe)
- ✅ Club-affiliated event organization
- ✅ Event announcements

### 🗺 Location Hierarchy
- ✅ Complete Rwanda administrative structure:
  - *Province* → *District* → *Sector* → *Cell* → *Village*
- ✅ Self-referential parent-child relationships
- ✅ Province code support for efficient querying

### 📢 Announcements
- ✅ Multi-level announcements (User, Club, Event)
- ✅ Timestamp tracking
- ✅ Targeted messaging system

### 🔐 Data Integrity
- ✅ Unique constraints on emails, phone numbers, and relationships
- ✅ Cascade operations for related entities
- ✅ Bidirectional relationship management

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| *Spring Boot 3.x* | Application framework |
| *Spring Data JPA* | Data persistence and ORM |
| *Hibernate* | JPA implementation |
| *MySQL/PostgreSQL* | Relational database |
| *Maven* | Dependency management |
| *Jackson* | JSON serialization/deserialization |


---

## 💻 System Requirements

- *Java:* 21
- *Maven:* 3.6+
- *Database:*  PostgreSQL 
- *IDE:*  VS Code 

---

## 🚀 Installation

### 1. Clone the Repository

bash
git clone https://github.com/Titus-30/CampusEventsAndClubManagementSystem_26421.git



### 2. Configure Database

Edit src/main/resources/application.properties:

properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/campusevents
spring.datasource.username=postgres
spring.datasource.password=titus

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server Configuration
server.port=8080


### 3. Build the Project

bash
mvn clean install


### 4. Run the Application

bash
mvn spring-boot:run


Or run the JAR file:

bash
java -jar target/campus-events-management-0.0.1-SNAPSHOT.jar


### 5. Access the API

The application will start at: http://localhost:8080

---

## 🗃 Database Schema

### Entity Relationship Diagram


<img width="1734" height="718" alt="image" src="https://github.com/user-attachments/assets/6a026c45-57c1-4820-b2f2-300a989e98cf" />



### Key Relationships

| Relationship Type | Entities | Description |
|-------------------|----------|-------------|
| *One-to-One* | User ↔ Profile | Each user has one profile |
| *Many-to-One* | User → Location | Multiple users per location |
| *Many-to-Many* | User ↔ Club | Via Membership join table |
| *Many-to-Many* | User ↔ Event | Via EventAttendance join table |

---

## 📚 API Documentation

### Base URL

http://localhost:8080/api


### 👤 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register a new user |
| GET | /user/all | Get all users |
| GET | /user/paginated | Get paginated users |
| GET | /user/search?email={email} | Search user by email |
| GET | /user/by-province/{province} | Get users by province |
| GET | /user/by-district/{district} | Get users by district |
| GET | /user/{id}/location | Get user's location |
| PUT | /user/update | Update user |
| DELETE | /user/delete/{id} | Delete user |

#### Example: Register User

bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Bruce RUGIRA",
    "email": "bruce@gmail.com",
    "phoneNumber": "+250788123456",
    "password": "stud123",
    "role": "STUDENT"
  }'


### 🏢 Club Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /club/add | Create a new club |
| GET | /club/all | Get all clubs |
| GET | /club/{id} | Get club by ID |
| GET | /club/status/{status} | Get clubs by status |
| PUT | /club/approve/{id} | Approve a club |
| PUT | /club/reject/{id} | Reject a club |
| PUT | /club/update | Update club |
| DELETE | /club/delete/{id} | Delete club |

#### Example: Create Club

bash
curl -X POST http://localhost:8080/api/club/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Science Club",
    "description": "Science and environment Club",
    "createdBy": {
      "id": 1
    }
  }'


### 📅 Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /event/add | Create a new event |
| GET | /event/all | Get all events |
| GET | /event/{id} | Get event by ID |
| PUT | /event/update | Update event |
| DELETE | /event/delete/{id} | Delete event |

#### Example: Create Event

bash
curl -X POST http://localhost:8080/api/event/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop",
    "description": "workshop covering Machine Learning",
    "venue": "Room 1",
    "startTime": "2025-12-01T09:00:00",
    "endTime": "2025-12-01T18:00:00",
    "club": {
      "id": 1
    },
    "category": {
      "id": 1
    }
  }'


### 🗺 Location Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /location/add | Add a new location |
| GET | /location/all | Get all locations |
| GET | /location/{id} | Get location by ID |
| PUT | /location/update | Update location |
| DELETE | /location/delete/{id} | Delete location |

### 🎫 Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /attendance/add | Mark event attendance |
| GET | /attendance/all | Get all attendances |
| GET | /attendance/{id} | Get attendance by ID |
| PUT | /attendance/update | Update attendance status |
| DELETE | /attendance/delete/{id} | Delete attendance |

### 📢 Announcement Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /announcement/add | Create announcement |
| GET | /announcement/all | Get all announcements |
| GET | /announcement/{id} | Get announcement by ID |
| PUT | /announcement/update | Update announcement |
| DELETE | /announcement/delete/{id} | Delete announcement |



---

## 📸 Postman Testing Screenshots

Below are the sample testing in postman

### Adding location

![WhatsApp Image 2025-10-29 at 16 41 13_28a1983e](https://github.com/user-attachments/assets/69dde501-b3b9-4584-acc0-f27e31e80693)

### Register User

![WhatsApp Image 2025-10-29 at 16 51 47_c15bc4bc](https://github.com/user-attachments/assets/4668c2c0-a39e-4090-bbf2-6e6b55b5db58)

### Update user

![WhatsApp Image 2025-10-29 at 16 57 15_c15fb7fd](https://github.com/user-attachments/assets/685a3bc6-7ead-4795-b427-1b63af55931e)

### Adding a profile

![WhatsApp Image 2025-10-29 at 17 01 45_d6a26651](https://github.com/user-attachments/assets/0e20c875-c864-45c9-ac10-ce5bc125ec7a)

### Adding event category

![WhatsApp Image 2025-10-29 at 17 29 02_23412991](https://github.com/user-attachments/assets/743ee5eb-c732-4c81-b880-f406fc39d297)

### Adding an event

![WhatsApp Image 2025-10-29 at 17 35 30_91f7bb39](https://github.com/user-attachments/assets/6b3dd8c7-c9b0-4fbc-9d65-b5ce5beda1de)

### Adding membership

![WhatsApp Image 2025-10-29 at 17 39 24_14a34533](https://github.com/user-attachments/assets/5fb6d1d5-03fb-4d07-8469-55941654ba33)

### Creating event attendance

![WhatsApp Image 2025-10-29 at 17 55 07_0eb71ed8](https://github.com/user-attachments/assets/232ef097-cb2e-48d6-ae39-283d3ba6a435)

### Creating announcement

<img width="1919" height="989" alt="image" src="https://github.com/user-attachments/assets/8d3671c5-ad37-49ff-a3c5-9a149ca399ef" />

---

## 📸 Database Tables Screenshots

Below are the actual database table structures for all entities in the system:

### 1. Users Table

![WhatsApp Image 2025-10-29 at 17 00 07_3f0b6958](https://github.com/user-attachments/assets/188817d0-2657-4f7e-9fdf-e56183098f49)

Core user information with roles (Student, Organizer, Admin) and location references

### 2. Profiles Table

![WhatsApp Image 2025-10-29 at 17 05 02_7050e2e3](https://github.com/user-attachments/assets/e889f47b-9864-47c5-b1ed-c5bc2728c979)

One-to-one relationship with Users - stores additional profile information

### 3. Locations Table

![WhatsApp Image 2025-10-29 at 16 43 28_bf4576e2](https://github.com/user-attachments/assets/b11e8c35-deb7-4c16-b584-0acea63763de)

Hierarchical structure: Province → District → Sector → Cell → Village

### 4. Clubs Table

![WhatsApp Image 2025-10-29 at 17 23 48_c7072315](https://github.com/user-attachments/assets/42d5743c-e4a9-4c79-95a0-b16bfc58f338)

Club information with approval status (Pending, Approved, Rejected)

### 5. Events Table

![WhatsApp Image 2025-10-29 at 17 37 05_7af49617](https://github.com/user-attachments/assets/2612ea23-a665-469c-81ba-dd4583b28604)

Event details with club affiliations, categories, and scheduling information

### 6. Event Categories Table

![WhatsApp Image 2025-10-29 at 17 30 06_61a104d6](https://github.com/user-attachments/assets/ceedbe87-51de-4d1e-849a-88e95eeb9bf1)

Categorization for events (Academic, Sports, Cultural, etc.)

### 7. Memberships Table

![WhatsApp Image 2025-10-29 at 17 52 44_7837cc73](https://github.com/user-attachments/assets/53c266a5-fdca-41f6-b2dd-aa16879b610e)

Join table tracking User-Club relationships with timestamps

### 8. Event Attendances Table

![WhatsApp Image 2025-10-29 at 17 56 14_2a2f87a1](https://github.com/user-attachments/assets/7b8c0f57-2a78-4962-90cb-62b36e7e3094)

Join table tracking User-Event relationships with attendance status

### 9. Announcements Table

![WhatsApp Image 2025-10-29 at 18 05 30_b31c4275](https://github.com/user-attachments/assets/f5cc141e-c3fb-4f51-bdfe-bb2f2bfa1bd2)

System-wide announcements linked to users, clubs, or events


---

## 💡 Usage Examples

### Pagination & Sorting

bash
# Get users with pagination
GET /api/user/paginated?page=0&size=10&sortBy=fullName&sortDirection=asc


### Location-Based Queries

bash
# Get all users in Kigali province
GET /api/user/by-province/Kigali

# Get all users in Gasabo district
GET /api/user/by-district/Gasabo


### Club Workflow

bash
# 1. Student creates a club (status: PENDING)
POST /api/club/add

# 2. Admin approves the club
PUT /api/club/approve/1

# 3. Get all approved clubs
GET /api/club/status/APPROVED


---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### Code Style Guidelines

- Follow Java naming conventions
- Write meaningful commit messages
- Add Javadoc comments for public methods
- Ensure all tests pass before submitting PR

---

## 🧪 Testing

Run unit tests:

bash
mvn test


Run integration tests:

bash
mvn verify


---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

*Titus Mucyo*
- GitHub: [@Titus-30](https://github.com/titus-30)
- Email: titusmucyo693@gmail.com


---


## 📞 Contact & Support

For questions, suggestions, or issues:

- 📧 Email: titusmucyo693@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Titus-30/CampusEventsAndClubManagementSystem_26421/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Titus-30/CampusEventsAndClubManagementSystem_26421/discussions)

---

<div align="center">

*⭐ Star this repository if you find it helpful!*

Made with ❤ by Titus Mucyo

</div>
