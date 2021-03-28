//----------------CONST AND USE---------------------->
const express = require("express")
var absorb = require('absorb');
const app = express()
const fs = require('fs');
const axios = require("axios");
const API_BASE_URL = "https://api.punkapi.com/v2/"
const BEERS_FILE_PATH = "beers.json"
const bodyParser = require('body-parser')


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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
    try{
        let beers = await getRepo()
        let beer = beers.filter(beer => beer.id === parseInt(req.params.id))
        res.json(beer)
    }
    catch (e) {
        res.json({error: e})
    }
})

//----------------DELETE BEERS ---------------------->
app.post("/beers/:id", async (req, res) => {
    try {
        let allBeers = await getRepo()
        let beers = allBeers.filter(beer => beer.id !== parseInt(req.params.id))
        await fs.promises.writeFile(BEERS_FILE_PATH, JSON.stringify(beers, null, 2))
        res.redirect("/")
    }
    catch (e) {
        res.json({error: e})
    }
})

//----------------UPDATE BEERS ---------------------->
app.put("/beers/:id", urlencodedParser, async (req, res) => {
    try {
        let beerData = req.body
        let beers = await getRepo()
        for(let beer of beers){
            if(beer.id === parseInt(req.params.id)){
                beer.name = beerData.name
                beer.first_brewed = beerData.first_brewed
                beer.description = beerData.description
                beer.tagline = beerData.tagline
                beer.abv = parseFloat(beerData.abv)
                beer.ebc = parseFloat(beerData.ebc)
                beer.volume["value"] = beerData.volume
            }
        }
        await fs.promises.writeFile(BEERS_FILE_PATH, JSON.stringify(beers, null, 2))
        res.redirect("/")
    }
    catch (e) {
        res.json({error: e})
    }
})

//----------------CREATE BEERS ---------------------->
app.post("/add", urlencodedParser, async (req, res) => {
    try {
        let beerData = req.body
        let beers = await getRepo()
        let lastBeerId = beers[beers.length - 1].id
        let beer = {
            "id": lastBeerId + 1,
            "name": beerData.name,
            "first_brewed": beerData.first_brewed,
            "description": beerData.description,
            "tagline": beerData.tagline,
            "abv": beerData.abv,
            "ebc": beerData.ebc,
            "volume": {
                "value": beerData.volume
            }
        }
        beers.push(beer)

        await fs.promises.writeFile(BEERS_FILE_PATH, JSON.stringify(beers, null, 2))
        res.redirect("/")
    }
    catch (e) {
        res.json({error: e})
    }
})

app.listen(1337)