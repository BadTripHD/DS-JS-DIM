//const { static } = require("express")
const express = require("express")
const app = express()
const fs = require('fs');
const axios = require("axios");
const API_BASE_URL = "https://api.punkapi.com/v2/"
const BEERS_FILE_PATH = "beers.json"

app.set("view engine", "ejs")
app.use("/css", express.static(__dirname + "/css"))
app.use("/js", express.static(__dirname + "/js"))
app.use("/assets", express.static(__dirname + "/assets"))

axios.get(API_BASE_URL + "beers")
    .then(response =>{
        let beers = JSON.stringify(response.data, null, 2)
        fs.access(BEERS_FILE_PATH, fs.F_OK, (err) =>{
            if(err){
                console.log(err)
                return
            }

            fs.writeFileSync(BEERS_FILE_PATH, beers, (error) => {
                if (error) throw error
                console.log("Data write in json file")
            })
        })
    })
    .catch(error => {
        console.log(error)
    })

//----------------MAIN PAGE---------------------->

app.get("/", (req, res) => {
    let rawData = fs.readFileSync("beers.json")
    let beers = JSON.parse(rawData)
    res.render("index", {
        beers: beers
    })

})

app.listen(1337)