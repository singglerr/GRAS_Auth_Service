const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const error = require("../errors");

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            res.status(500);

            return res.send({
                success: false,
            });
        }

        res.send({
            success: true,
        });
    });
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if (!candidate) {
            res.status(404);

            return res.send({
                success: false,
                message: error.USER_NOT_FOUND,
            });
        }

        const isSame = await bcrypt.compare(password, candidate.password);
        if (!isSame) {
            res.status(500);

            return res.send({
                success: false,
                message: error.USER_WRONG_PASSWORD,
            });
        }

        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
            if (err) {
                throw err;
            }

            res.send({
                success: true,
            })
        })
    } catch (e) {
        console.log(e);
    }
});

router.post("/register", async (req, res) => {
    try {
        const {email, name, password} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            res.status(500);
            return res.send({
                success: false,
                message: error.USER_ALREADY_EXISTS,
            });
        }

        if (password !== confirm) {
            res.status(500);
            return res.send({
                success: false,
                message: error.PASSWORD_MISMATCH,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, password: hashPassword, name
        });

        await user.save();

        res.send({
            success: true,
        })
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;