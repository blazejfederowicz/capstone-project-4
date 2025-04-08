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
    try{
        const response = await axios.get("https://api.lyrics.ovh/v1/Coldplay/Adventure of a Lifetime") 
        const result= response.data
        console.log(result)
        res.render("index.ejs")
    } catch(error){
        console.error(error)
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`);
})