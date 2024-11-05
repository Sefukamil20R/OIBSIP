const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3005;
app.use(express.static(__dirname));

const users = [];

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
}));

// Helper function to check if user is logged in
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Register endpoint
app.get("/register", (req, res) => {
  const errorMessage = req.query.error ? decodeURIComponent(req.query.error) : "";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div class="container">
          <h2>Register</h2>
          ${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ""}
          <form action="/register" method="POST">
            <label>Username:</label>
            <input type="text" name="username" required>
            <label>Email:</label>
            <input type="email" name="email" required>
            <label>Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </body>
    </html>
  `);
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if username or email already exists
  if (users.find(user => user.username === username || user.email === email)) {
    return res.redirect(`/register?error=${encodeURIComponent("Username or email already exists. Please choose another.")}`);
  }

  // Hash the password and save the user
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, email, password: hashedPassword });
  res.redirect("/login");
});

// Login endpoint
app.get("/login", (req, res) => {
  const errorMessage = req.query.error ? decodeURIComponent(req.query.error) : "";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div class="container">
          <h2>Login</h2>
          ${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ""}
          <form action="/login" method="POST">
            <label>Username:</label>
            <input type="text" name="username" required>
            <label>Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </body>
    </html>
  `);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    res.redirect("/secure");
  } else {
    res.redirect(`/login?error=${encodeURIComponent("Invalid username or password. Please try again.")}`);
  }
});

// Secure page (only accessible when logged in)
app.get("/secure", checkAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Secure Page</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Welcome, ${req.session.user} to This Page!</h1>
          <p>Here's some exclusive content for logged-in users:</p>
          <ul>
            <li>Exclusive Resources</li>
            <li>Member-Only Discounts</li>
            <li>Community Chat Access</li>
          </ul>
          <a href="/logout" class="back-button">Back to Login</a>
        </div>
      </body>
    </html>
  `);
});

// Logout endpoint
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
