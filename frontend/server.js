import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import path from "path";

const app = express();
const port = 5000;

env.config();

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Static files (for homepage.html in /public)
app.use(express.static("public"));

// Home route with Register & Login buttons
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Google OAuth trigger
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/auth/google/TARP",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    // Success → redirect to homepage.html
    res.sendFile(path.join(process.cwd(), "homepage.html"));
  }
);

// Logout route
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/TARP", // ✅ must match Google Cloud Console
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

// Serialize & Deserialize user
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
