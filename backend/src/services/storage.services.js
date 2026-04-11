const imagekit = require('@imagekit/nodejs').default

const client = new imagekit({
    PublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    PrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    // UrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadFile = async (buffer, fileName , folder = "") => {

    const file = await client.files.upload({
        file : await imagekit.toFile(Buffer.from(buffer)),
        fileName:fileName , 
        folder

    })


    return file
}
module.exports = {uploadFile}

