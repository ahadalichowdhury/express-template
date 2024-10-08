const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanatize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./src/utils/appError");
const globalErrorHanlder = require("./src/controllers/errorController");

//route import
const tourRoute = require("./src/routes/tourRoute")
const userRoute = require("./src/routes/userRoute")

const app = express();

// GLOBAL MIDDLEWARES

// Implement CORS
app.use(cors()); // To allow everyone
// Access-Control-Allow-Origin *

// If we want to give access to only one domain:
// app.use(cors({
//   origin: 'https://www.natours.com'
// }));

app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());

// Development logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
// we can limit the amount of data that comes in the body

// This middleware parses the data from cookies
app.use(cookieParser());

// We need this middleware to parse data coming from a URL encoded form
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanatize());

// Data sanatization against XSS
app.use(xss());

app.use(compression()); // this is going to compress all the text that is sent to clients (not images)

//ROUTES

// app.use("/", viewRouter);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/reviews", reviewRouter);
// app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHanlder);

module.exports = app;
