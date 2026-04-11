const Song = require('../model/songs.model').default;
const id3 = require('node-id3');
const sotrageService = require('../services/storage.services');


const uploadAudio = async (req, res) => {

    
    
    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    const tags = id3.read(songBuffer);

    const [songFile , posterFile] = await Promise.all([
        sotrageService.uploadFile({
            buffer: songBuffer,
            fileNAme: tags.title + ".mp3" ,
            folder: "moodify/songs"

        }) , 
        sotrageService.uploadFile({
            buffer: tags.image.imageBuffer,
            fileNAme: tags.title + ".jpg" ,
            folder: "moodify/posters"
        })
      
    ]);

    const song = await Song.create({
        title : tags.title,
        url : songFile.url,
        posterUrl : posterFile.url,
        mood : mood
    })

    res.status(201).json({message : "Song uploaded successfully" , song : song})
     
};

const getSongs = async (req, res) => {
    const { mood } = req.query;

    const songs = await Song.find(mood ? { mood: mood } : {});

    res.status(200).json({ songs: songs });

}


module.exports = {
    uploadAudio ,
    getSongs
};