const config = require("./config");
const path = require("path");

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");

const PostsRoutes = require("./routes/post");
const AuthRoutes = require("./routes/auth");

const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const app = express();

const store = new MongoStore({
    collection: "session",
    uri: config.MONGO_URI,
});

app.use(express.static(path.join(__dirname, "_dist")));
app.use(morgan('combined'));
app.use(express.json());
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use(cors());
app.use(csurf());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/posts", PostsRoutes);
app.use("/auth", AuthRoutes);

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