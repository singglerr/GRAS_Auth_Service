const config = require("./config");
const path = require("path");
const userUtil = require("./utils/user");
const User = require("./models/user");

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const uuid = require("uuid").v4;

const APIRoutes = require("./routes");

// creation
const app = express();

passport.use(new LocalStrategy(
    {usernameField: "email"},
    userUtil.findToLogIn
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user || false);
});

const store = new MongoStore({
    collection: "session",
    uri: config.MONGO_URI,
});

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('combined'));
app.use(express.json());
app.use(session({
    genid: (req) => {
        return uuid();
    },
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: false,
        httpOnly: false,
    },
    store,
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api", APIRoutes);

async function start() {
    try {
        let error;
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }, (err) => {
            if (err) {
                error = err;
            } else {
                console.log("[MongoDB]:", "Connected");
            }
        });

        if (error) {
            throw error;
        }

        app.listen(config.PORT, () => {
            console.log("[Application]:", `Server is running on port ${config.PORT}...`);
        });
    } catch (error) {
        console.error(error);
    }
}

start();