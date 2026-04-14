const songModel = require("../model/songs.model")
const storageService = require("../services/storage.services")
const id3 = require("node-id3")

async function uploadSong(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Song file is required" });
        }

        const songBuffer = req.file.buffer;
        const { mood } = req.body;

        if (!mood) {
            return res.status(400).json({ message: "Mood is required" });
        }

        const tags = id3.read(songBuffer) || {};
        const songTitle = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "");
        const artist = tags.artist || "Unknown Artist";
        const posterBuffer = tags.image?.imageBuffer;
        const fileExtension = req.file.originalname.split(".").pop() || "mp3";

        const songFile = await storageService.uploadFile({
            buffer: songBuffer,
            fileName: `${songTitle}.${fileExtension}`,
            folder: "moodify/songs"
        });

        let posterUrl = "";

        if (posterBuffer) {
            const posterFile = await storageService.uploadFile({
                buffer: posterBuffer,
                fileName: `${songTitle}.jpeg`,
                folder: "moodify/posters"
            });
            posterUrl = posterFile.url;
        }

        const song = await songModel.create({
            title: songTitle,
            artist,
            url: songFile.url,
            posterUrl,
            mood
        });

        res.status(201).json({
            message: "song created successfully",
            song
        });
    } catch (error) {
        console.error("Song upload failed:", error);
        res.status(500).json({ message: "Song upload failed" });
    }
}

async function getSong(req, res) {
    try {
        const { mood } = req.query;

        const query = mood ? { mood } : {};
        const song = await songModel.findOne(query);

        res.status(200).json({
            message: "song fetched successfully.",
            song,
        });
    } catch (error) {
        console.error("Song fetch failed:", error);
        res.status(500).json({ message: "Unable to fetch song" });
    }
}

const getMoodPlaylist = async (req, res) => {
  try {
    const { mood } = req.params;

    const songs = await songModel.find({
      mood: { $in: [mood] }
    }).limit(20);

    if (!songs.length) {
      return res.status(404).json({
        success: false,
        message: "No songs found for this mood"
      });
    }

    res.status(200).json({
      success: true,
      total: songs.length,
      playlist: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAdminSongs = async (req, res) => {
  try {
    const songs = await songModel.find().sort({ _id: -1 });

    res.status(200).json({
      success: true,
      total: songs.length,
      songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




module.exports = { uploadSong, getSong , getMoodPlaylist, getAdminSongs }
