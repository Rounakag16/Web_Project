# Food Donation Web Application

## Project Overview
This web application is designed to **manage food donations**, allowing users to sign up, log in, and submit donations. It connects to a **MongoDB database** to store user and donation information, ensuring a seamless experience for both **donors** and **receivers**.

## Project Type
This is a **college project** intended for submission.

## Features
- **User Authentication:** Sign up and log in functionality
- **Geo-location Support:** Donations can be submitted with location details
- **Image Upload:** Users can attach images when submitting a donation
- **Donation Browsing:** View available donations based on location

## Getting Started

### Prerequisites
Ensure you have the following installed before setting up the project:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MongoDB](https://www.mongodb.com/) (Local or cloud instance)
- Git (optional, for cloning the repository)

### Installation Instructions
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory**
   ```bash
   cd webproject
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables** (Create a `.env` file in the root directory and add the following:)
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

## Usage
To start the server, run:
```bash
npm start
```
The server will run on: **`http://localhost:3000`**

## API Routes
| Method | Endpoint       | Description                     |
|--------|--------------|---------------------------------|
| `GET`  | `/`          | Home page                      |
| `POST` | `/signup`    | User signup                    |
| `POST` | `/login`     | User login                      |
| `GET`  | `/donor`     | Donor page                      |
| `POST` | `/donor`     | Submit a donation               |
| `GET`  | `/receiver`  | Receiver page                   |
| `POST` | `/receiver`  | Retrieve donations by location  |

## Dependencies
The project uses the following Node.js packages:
- **Express** - Web framework
- **Mongoose** - MongoDB object modeling
- **Body-parser** - Parse request bodies
- **Cookie-parser** - Handle cookies
- **Express-session** - Session management
- **Express-fileupload** - File upload handling

## Contributing
Contributions are welcome! If you’d like to contribute:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes
4. Submit a pull request

## License
This project is licensed under the **ISC License**.
