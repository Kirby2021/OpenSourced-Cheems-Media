const { Schema, model } = require('mongoose');

const staffSchema = Schema({
    _id: String,
    job: String,
    name: String,
    avatar: String,
})

module.exports = model('staff', staffSchema);
