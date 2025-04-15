import express from "express";
import axios from "axios";
import Genius from "genius-lyrics";
import 'dotenv/config'

const Client = new Genius.Client(process.env.GENIUS_API_TOKEN);
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
        const findLyrics = await axios.get(`https://api.audd.io/findLyrics/`,{
            params:{
                q:`${title.trim()} ${artist.trim()}`,
                api_token: process.env.AUDD_API_TOKEN
            },
            timeout: 5000
        })
        const lyrics = findLyrics.data.result
        const result= response[0]
        const fullTitle = result.fullTitle;
        const url = result.url

        if(lyrics && lyrics.length>0){
            let slicedLyrics = lyrics[0].lyrics;

            const formattedLyrics = slicedLyrics.trim().split('\n').join('<br>')

            res.render("index.ejs",{
                lyrics: formattedLyrics,
                title: fullTitle,
                url:url
            })
        }else{
            res.render("index.ejs",{
                lyrics: "We couldn't find lyrics for this song.",
                title: fullTitle,
                url:url
            })
        }
        
    } catch(error){
        console.error(error)
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