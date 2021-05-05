const { Schema, model } = require('mongoose');

const postSchema = Schema({
    _id: String,
    postId: String,
    author: String,
    text: String,
})

module.exports = model('comments', postSchema);