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
            const firstVerse = lyrics.indexOf("[Verse 1]")
            const musicVideo = lyrics.indexOf("[Music Video]")

            let slicedLyrics

            if (firstVerse !== -1 && musicVideo !== -1 && firstVerse < musicVideo) {
                slicedLyrics = lyrics.slice(firstVerse, musicVideo);
            } else {
                slicedLyrics = lyrics; // fallback to full lyrics
            }

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
        res.render("index.ejs",{
            lyrics: "An error occurred while fetching lyrics.",
            title: "",
            url: ""
        })
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
})