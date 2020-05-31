const {Schema, model} = require("mongoose");

const PostSchema = new Schema({
    title: String,
    description: String
});

module.exports = model("Post", PostSchema);
