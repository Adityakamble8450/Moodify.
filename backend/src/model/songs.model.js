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
    artist: {
        type: String,
        default: "Unknown Artist"
    },
    mood: {
        type: String,
        enum: {
            values: ["sad", "happy", "surprised"],
            message: "Enum this is"
        },
        required: true
    }
}); const Song = mongoose.model('Song', songSchema);

module.exports = Song;
