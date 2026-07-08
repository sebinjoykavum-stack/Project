# 🎵 SoundWave - Concert Booking System

A full-stack Concert Booking System built to manage concerts, users, ticket reservations, and administrative operations.

## 🚀 Features

### User
- User registration and login
- JWT authentication
- Browse concerts
- Check ticket availability
- Book tickets
- Dynamic price calculation

### Admin
- Add concerts
- Update concert details
- Delete concerts
- Manage ticket capacity and pricing

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript ES6
- Bootstrap 5

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose ODM

**Security**
- JWT Authentication
- Bcrypt Password Hashing

## 🏗️ Architecture

Client → Express API → Authentication Middleware → MongoDB

## 📂 Database Models

### User
- name
- email
- age
- password
- admin role

### Concert
- concertId
- concertName
- date
- venue
- price
- totalTickets

### Ticket
- userId
- concertId
- numberOfTickets
- totalAmount

## 🔐 Authentication

The application uses JWT tokens for secure authentication.

Protected requests require:

```
Authorization: Bearer <token>
```

Passwords are encrypted using bcrypt before storing them in the database.

## 📌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /create_user_api | Register user |
| POST | /login_user_api | Login user |
| GET | /veiw_concert_api | View concerts |
| POST | /concert_add_api | Add concert |
| PUT | /edit_concert_api/:id | Edit concert |
| DELETE | /delete_concert_api/:id | Delete concert |
| POST | /Ticket_booking_api | Book tickets |

## ⚙️ Installation

Clone repository:

```bash
git clone https://github.com/yourusername/SoundWave.git
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/concertDetails
JWT_SECRET=your_secret_key
```

Run project:

```bash
npm start
```

## 🎟️ Booking Rules

- Maximum 3 tickets per user
- Live ticket availability checking
- Automatic total price calculation
- Sold out validation

## 🔮 Future Improvements

- Online payment integration
- QR code ticket generation
- Email confirmation
- Cloud deployment
- Seat selection system

## 👨‍💻 Developer

**Sebin Joy**

GitHub: https://github.com/sebinjoykavum-stack

LinkedIn: https://www.linkedin.com/in/sebin-joy-ba26722b5/

⭐ If you like this project, consider giving it a star!
