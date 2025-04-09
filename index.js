import express from "express";
import axios from "axios";
import Genius from "genius-lyrics";

const Client = new Genius.Client();
const app = express()
const PORT = 3000;

app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render("index.ejs")
})

app.post('/',async (req,res)=>{
    const {title, artist} = req.body
    try{
        const response = await Client.songs.search(`${title} ${artist}`);
        const result= response[0] //.replace(/\r\n|\r/g, '\n').split('\n\n').join('<br>')
        const lyrics = await result.lyrics()
        const firstVerse = lyrics.indexOf("[Verse 1]")
        const slicedLyrics = lyrics.slice(firstVerse).split('\n').join('<br>')
        res.render("index.ejs",{lyrics: slicedLyrics})
    } catch(error){
        res.render("index.ejs",{error: "We couldn't find lyrics for this song."})
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
})