const config = require("./config");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require("mongoose");

const PostsRoutes = require("./routes/post");

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.use("/posts", PostsRoutes);

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