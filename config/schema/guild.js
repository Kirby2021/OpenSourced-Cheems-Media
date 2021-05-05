const {Schema, model} = require('mongoose')

const guildSchema = Schema({
    _id: String,
    feedChannel: String,
    followedPosters: {
        type: Array,
        default: []
    }
})

module.exports = model('guild', guildSchema)