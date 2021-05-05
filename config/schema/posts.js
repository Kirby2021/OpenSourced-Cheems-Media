const { Schema, model } = require('mongoose');

const postSchema = Schema({
    _id: String,
    author: String,
    title: String,
    description: String,
    image: String,
    cheems: Number,
    checked: {
        type: Boolean,
        default: false
    },
    cheemGivers: {
        type: [String],
        default: []
    },
    cheemTakers: {
        type: [String],
        default: []
    }
})

module.exports = model('posts', postSchema);
