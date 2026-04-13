const songModel = require("../model/songs.model")
const storageService = require("../services/storage.services")
const id3 = require("node-id3")

async function uploadSong(req, res) {
    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)
    const songTitle = tags.title || req.file.originalname.replace(/\.[^/.]+$/, "")

    const [songFile] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            fileName: songTitle + ".mp3",
            folder: "moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            fileName: songTitle + ".jpeg",
            folder: "moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: songTitle,
        url: songFile.url,
        posterUrl: "",
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })
}

async function getSong(req, res) {
    const { mood } = req.query

    const song = await songModel.findOne({
        mood,
    })

    res.status(200).json({
        message: "song fetched successfully.",
        song,
    })
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





module.exports = { uploadSong, getSong , getMoodPlaylist }