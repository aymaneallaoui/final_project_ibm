const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
const PORT = 5000;

app.use(express.json());

// Set up session middleware for /customer routes
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware to authenticate user based on JWT token stored in session
app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "access_token_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = decoded; // Attach user information to request
    next(); // Proceed to the next middleware/route handler
  });
});

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
