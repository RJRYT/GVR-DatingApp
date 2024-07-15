require("dotenv").config({ path: "./src/.env" });
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

//Configure CORS
const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `Request from origin ${origin} has been blocked by CORS policy`;
      return callback(msg, false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

//request logger
app.use(morgan("dev"));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cookie-parser
app.use(cookieParser());

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mostsecuredsecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect to database
const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to dating application api." });
});

require("./app/config/passport.config")(passport);

require("./app/routes/auth.routes")(app);
require("./app/routes/users.routes")(app);

//Error handling
app.use(function (req, res) {
  res.status(404).json({ message: "Resource not found" });
});

app.use(async function (err, req, res, next) {
  if (!err) {
    return next();
  }
  console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
  console.log(err, err.stack);
  res
    .status(500)
    .json({ message: "An Unknown error occoured in server. Try again later" });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`${promise}, ${reason.stack}`, reason);
});

process.on("uncaughtException", (err, origin) => {
  console.log(`${err.stack}, ${origin}`);
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
