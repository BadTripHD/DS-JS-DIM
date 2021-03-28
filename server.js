//----------------CONST AND USE---------------------->
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

//----------------GET API DATA AND CREATE JSON FILE IF NOT EXIST---------------------->

axios.get(API_BASE_URL + "beers")
    .then(response =>{
        let beers = JSON.stringify(response.data, null, 2)
        if(!fs.existsSync(BEERS_FILE_PATH)){
            fs.writeFileSync(BEERS_FILE_PATH, beers, (error) => {
                if (error) throw error
                console.log("Data write in json file")
            })
        }
    })
    .catch(error => {
        console.log(error)
    })

//----------------FUNCTION---------------------->

async function getRepo() {
    return JSON.parse(
        await fs.promises.readFile(BEERS_FILE_PATH, {
            encoding: "utf-8"
        })
    )
}

//----------------MAIN PAGE---------------------->

app.get("/", async (req, res) => {
    try{
        let beers = await getRepo()

        res.render("index", {
            beers: beers
        })
    }
    catch (e) {
        res.json({error: e})
    }

})

//----------------GET BEERS BY ID---------------------->

app.get("/beers/:id", async (req, res) => {
    let beers = await getRepo()
    try{
        let beer = beers.filter(beer => beer.id === parseInt(req.params.id))
        res.json(beer)
    }
    catch (e) {
        res.json({error: e})
    }
})

//----------------DELETE BEERS ---------------------->
app.post("/beers/:id", (req, res) => {
    let
})
//----------------UPDATE BEERS ---------------------->

app.listen(1337)