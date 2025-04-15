import express from "express";
import axios from "axios";
import Genius from "genius-lyrics";
import 'dotenv/config'

const Client = new Genius.Client();
const app = express()
const PORT = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`

app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render("index.ejs")
})

app.post('/',async (req,res)=>{
    const {title, artist} = req.body
    try{
        const response = await Client.songs.search(`${title.trim()} ${artist.trim()}`);

        if (!response || response.length === 0) {
            return res.render("index.ejs", {
                lyrics: "No matching song found.",
                title: "",
                url: ""
            });
        }

        const result= response[0] //.replace(/\r\n|\r/g, '\n').split('\n\n').join('<br>')
        const lyrics = await result.lyrics()

        if(lyrics.trim().length>0){
            const firstVerse = lyrics.indexOf("[")
            const musicVideo = lyrics.indexOf("[Music Video]")

            let slicedLyrics = lyrics.slice(firstVerse===-1?0:firstVerse, musicVideo===-1?lyrics.length-1:musicVideo);

            if(firstVerse===musicVideo) slicedLyrics = lyrics;

            const formattedLyrics = slicedLyrics.trim().split('\n').join('<br>')
            const fullTitle = result.fullTitle;
            const url = result.url

            res.render("index.ejs",{
                lyrics: formattedLyrics,
                title: fullTitle,
                url:url
            })
        }else{
            res.render("index.ejs",{
                lyrics: "We couldn't find lyrics for this song.",
                title: "",
                url:""
            })
        }
        
    } catch(error){
        console.error(error)
        res.sendStatus(500).render("index.ejs",{
            lyrics: "An error occurred while fetching lyrics.",
            title: "",
            url: ""
        })
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
})