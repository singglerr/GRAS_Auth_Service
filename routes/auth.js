const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const error = require("../errors");
const passport = require("passport");

router.get("/logout", (req, res) => {
    req.logout();
    res.send({
        success: true,
    })
});

router.get("/loggedIn", (req, res) => {
    res.send({
        isLoggedIn: req.isAuthenticated(),
    })
});

router.post("/login", async (req, res, next) => {
    passport.authenticate("local", {
        session: true,
    }, (err, user, info) => {
        if (err) {
            console.error("[Auth /login]:", err);
        }

        req.login(user, (error) => {
            if (error) {
                return res.send({
                    success: false,
                    message: info.message,
                });
            }

            return res.send({
                success: true,
            })
        })
    })(req, res, next);
});

router.post("/register", async (req, res) => {
    try {
        const {email, name, password, passConfirm} = req.body;
        if (!email || !password || !passConfirm) {
            return res.send({
                success: false,
                message: error.MISSING_CREDENTIALS,
            })
        }

        const candidate = await User.findOne({email: email});

        if (candidate) {
            return res.send({
                success: false,
                message: error.USER_ALREADY_EXISTS,
            });
        }

        if (password !== passConfirm) {
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