# 📚 Library Trader — Book Exchange Platform

**Library Trader** is a full-stack web application that allows users to trade books in a simple, organized, and secure way. It features both a **backend** (Node.js + Express + MongoDB) and a **frontend** (HTML, SASS, and Vanilla JavaScript), offering a complete system for book management, authentication, exchange handling, and notifications.

---

## 🚀 Features

### 🔐 Authentication

- User registration with custom validations.
- Secure login using cookies (`httpOnly`, `SameSite`, `Secure`).
- JWT-based token authentication via middleware.
- Logout mechanism that clears session cookies.

### 👤 User Dashboard

- Access and edit personal information and password.
- View:
  - Uploaded books.
  - Sent trade requests.
  - Exchange notifications (accepted/rejected).

### 📖 Book Management

- Add books with a title and short description.
- Prevent duplicate books per user (same title).
- View all books proposed by any user.
- Remove previously uploaded books.

### 🔄 Trade System

- Request a book from another user with a custom message.
- Logical validation to prevent:
  - Requesting books you already own.
  - Requesting your own books.
  - Sending multiple requests for the same book to the same user.
- Notifications sent to the receiver with the option to accept or reject.
- Automatic transfer of book ownership upon acceptance.
- Self-cleaning system to delete invalid or outdated requests.

### 🔔 Notifications

- Receive alerts when:
  - You get a book request.
  - A request you sent was accepted or rejected.
  - A book has already been acquired before a response.
- Smart notification cleanup to avoid duplication or invalid states.

### 🌍 Community

- Browse all registered users.
- See the list of all active or completed trades.

---

## 🧑‍💻 Tech Stack

### ⚙️ Backend  
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js**  
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) **Express.js**  
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB** with Mongoose  
- ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) **JWT** authentication  
- ![Cookie Parser](https://img.shields.io/badge/Cookie--Parser-lightgrey?style=flat) **Cookie-Parser** for secure cookies  
- ![CORS](https://img.shields.io/badge/CORS-enabled-blue?style=flat) **CORS** with dynamic origin and credentials  
- ![dotenv](https://img.shields.io/badge/dotenv-8DD6F9?style=flat&logo=dotenv&logoColor=black) **dotenv** for environment management  
- 🧩 Custom middlewares (validation, sanitization, normalization)

### 🎨 Frontend  
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5**  
- ![SASS](https://img.shields.io/badge/SASS-CC6699?style=flat&logo=sass&logoColor=white) **SASS (SCSS)**  
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **Vanilla JavaScript**  
- ![Fetch API](https://img.shields.io/badge/Fetch%20API-native-blue?style=flat) **Fetch API** with cookie credentials enabled  
- ✅ Fully functional **CRUD** using HTTP methods:
  - `GET`: fetch data (books, users, trades, profile)
  - `POST`: register, login, add books, request trades
  - `PATCH`: update profile info or trade status
  - `DELETE`: remove books or items from profile  
- 💎 Clean, responsive, and user-focused UI

---

## 👤 Author

Developed as an academic project by [codeRazX](https://github.com/codeRazX).  
All code is original and structured for clarity, usability, and extensibility.


