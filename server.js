const { static } = require("express")
const express = require("express")
const app = express()
const axios = require("axios");
const API_BASE_URL = "https://api.punkapi.com/v2/"

app.set("view engine", "ejs")
app.use("/css", express.static(__dirname + "/css"))

//----------------MAIN PAGE---------------------->

app.get("/", (req, res) => {

    axios.get(API_BASE_URL + "beers")
        .then(response =>{
            let beers = response.data
            res.render("index", {
                beers: beers
            })
        })
        .catch(error => {
            console.log(error)
        })

})

app.listen(1337)