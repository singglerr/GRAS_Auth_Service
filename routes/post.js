const router = require("express").Router();
const Post = require("../models/post");
const isAuth = require("../middleware/isAuth");


router.get('/', isAuth, (req, res) => {
    Post.find({}, 'title description', function (error, posts) {
        if (error) {
            console.error(error);
        }

        res.send({
            posts: posts
        })
    }).sort({_id: -1})
});


router.post('/add', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const new_post = new Post({
        title: title,
        description: description
    });

    new_post.save(function (error) {
        if (error) {
            console.log(error)
        }

        res.send({
            success: true
        })
    })
});

router.put('/:id', (req, res) => {
    Post.findById(req.params.id, 'title description', function (error, post) {
        if (error) {
            console.error(error);
        }

        post.title = req.body.title;
        post.description = req.body.description;
        post.save(function (error) {
            if (error) {
                console.log(error)
            }

            res.send({
                success: true
            })
        })
    })
});

router.delete('/:id', (req, res) => {
    Post.deleteOne({
        _id: req.params.id
    }, function (err, post) {
        if (err) {
            return res.send(err);
        }

        res.send({
            success: true
        })
    })
});

router.get('/:id', (req, res) => {
    Post.findById(req.params.id, 'title description', function (error, post) {
        if (error) {
            console.error(error);
        }

        res.send(post)
    })
});

module.exports = router;