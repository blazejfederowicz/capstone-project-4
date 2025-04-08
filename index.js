import express from "express";
import axios from "axios";

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
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`) 
        const result= response.data
        res.render("index.ejs",{lyrics: result.lyrics})
    } catch(error){
        console.error(error)
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
})