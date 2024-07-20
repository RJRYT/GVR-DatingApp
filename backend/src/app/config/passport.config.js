const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const googleId = profile.id;
        const email = profile.emails[0].value;

        try {
          // Check if a user with the Google ID already exists
          let user = await User.findOne({ googleId });

          if (user) {
            // If user exists with Google ID, return the user
            return done(null, user);
          }

          // Check if an email is already associated with another user
          user = await User.findOne({ email });

          if (user) {
            // Update the existing user with the Google ID
            if (!user.googleId) {
              user.googleId = googleId;
              user.emailVerified = true; // Assuming the Google login means email is verified
              await user.save();
            }

            // Return the updated user
            return done(null, user);
          }

          // Create a new user with Google details
          user = await User.create({
            googleId,
            username: profile.displayName,
            email,
            emailVerified: true
          });

          done(null, user);
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); 
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
