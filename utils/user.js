const User = require("../models/user");
const error = require("../errors");
const bcrypt = require("bcrypt");

module.exports = {
    findToLogIn: async (email, password, done) => {
        const user = await User.findOne({email});

        if (!user) {
            return done(null, false, {message: error.USER_NOT_FOUND});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return done(null, false, {message: error.USER_INCORRECT_PASSWORD});
        }

        return done(null, user);
    },
};

