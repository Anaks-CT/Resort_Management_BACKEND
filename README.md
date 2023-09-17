# Resort Management Project - Backend

A MERN Stack resort booking web application, featuring a user-friendly interface that allows users to effortlessly book rooms from a diverse selection of resorts which offers a wide range of room types and packages to cater to individual preferences. The application efficiently manages multiple resorts, each with its assigned managers.


## Features

- Twilio OTP verification.
- Room Packages with unique benefits for user preferences.
- Points System that rewards users for bookings and can be redeemed in future reservations.
- Membership loyalty scheme which offers exclusive benefits for the users.
- Wishlist for saving preferred dates for future bookings effortlessly.
- Razorpay payment gateway for a safe and seamless payment experience.
- Manager-side Management for managing gallery, users, rooms, FAQs
- Admin-side Management for managing managers, Resorts, etc.

## Technologies Used

- TypeScript
- NodeJS with Express.js
- MongoDB with Mongoose
- JWT authorization
- RESTful API
- Deployed on AWS utilizing an EC2 instance managed by NGINX.

- **Repository Design Pattern**:

  - Extensive use of **OOPS programming paradigm**.
  - Access to the database is from the repository only.
  - Generic CRUD Repository
  - Easy to replace the database.
  - Easy to replace third-party modules.
- **Backend Validation**:

  - Request Body: Yup module and custom RegEx.
  - Request Params: Validator module.
- **Error handling**

  - Error handled globally.
  - Errors handled through the OOPS programming paradigm.
  - Separation of operational and unexpected errors.

## Users

There are 3 types of users in the application:

- Admin
- Managers
- Guests
