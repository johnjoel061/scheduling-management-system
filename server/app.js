const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');
const cors = require("cors");
const app = express();

//===== ROUTERS ====//
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const facilityRouter = require('./routes/facilityRoute');
const schedulingRequestRouter = require('./routes/schedulingRequestRoute');


//===== ENVIRONMENT VARIABLES ====//
dotenv.config({ path: path.join(__dirname, "./.env") });

//===== DATABASE CONFIGURATION ====//
const connectDB = require("./confiq/db");

//===== MIDDLEWARE ====//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

//===== DATABASE CONNECTION ====//
const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;
const DB_OPTIONS = {
  dbName: process.env.MONGODB_DATABASE_NAME,
  autoIndex: true,
};

// Debugging: Log DB_OPTIONS to ensure they are correctly set
//console.log("DB_OPTIONS:", DB_OPTIONS);

// Connect to the database
connectDB(MONGODB_CONNECTION_URL, DB_OPTIONS);

//===== ROUTING IMPLEMENTATION ====//
app.use("/api/auth", authRouter);
app.use("/api/admin", userRouter);
app.use("/api/location", facilityRouter);
app.use("/api/book", schedulingRequestRouter);


//===== GLOBAL ERROR HANDLER ====//
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Serve static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "public")));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Vite app files in development
if (process.env.NODE_ENV === "development") {
  // Use the Vite dev server URL to proxy API requests
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      next(); // Let API requests go through
    } else {
      // For all other requests, send to Vite
      const viteDevServerURL = 'http://localhost:5173'; // Default Vite port
      res.redirect(viteDevServerURL + req.originalUrl);
    }
  });
}

// Handle 404 errors
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: "404 Not Found" });
  } else {
    res.json({ message: '404 Not Found' });
  }
});

module.exports = app;
