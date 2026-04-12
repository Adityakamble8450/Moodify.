const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
     url: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
       default : ""
    },
    title: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        enum: {
            values: [ "sad", "happy", "surprised" ],
            message: "Enum this is"
        }
    }
}); const Song = mongoose.model('Song', songSchema);

module.exports = Song;