const { Strategy, ExtractJwt } = require('passport-jwt')
const User = require("../model/schema/user");

const applyPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = process.env.SECRET_KEY;
  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, {
            email: user.email,
            _id: user['_id']
          });
        }
        return done(null, false);
      });
    })
  );
};

module.exports = applyPassportStrategy