const passport = require("passport");
const User = require("../models/user.model.js");
const UserModel = require("../models/user.model.js");
const GitHubStrategy = require("passport-github2").Strategy;
const config = require('./config.js');

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENTID,
        clientSecret: config.GITHUB_CLIENTSECRET,
        callbackURL: config.GITHUB_CALLBACK,
        scope: ["user:email", "read:user"]
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value; // Obtiene el primer email de la lista
          const name = profile.displayName || profile.username || profile._json.login || "Unknown"; // Obtiene el nombre de usuario de GitHub

          let user = await User.findOne({ email });
          if (!user) {
            let newUser = {
              first_name: name || "Unknown",
              last_name: " ",
              age: 37,
              email,
              password: " ",
              rol: "usuario"
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // Serializa solo el ID del usuario
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
};

module.exports = initializePassport;
