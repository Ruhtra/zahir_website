require('dotenv').config()
const express = require("express");
const http = require('http');
const Joi = require('joi');
const cors = require('cors')

const configEngine = require("./config/viewEngine.js");
const Database = require("./functions/queryDB.js");

async function startingModules() {
    console.log(" >. starting modules")

    await Database.testConnect()
        .then(console.log)
        .catch(console.log)
}


const main = async () => {
    // Variables
        const PORT = process.env.PORT || 4000
    
    // Config server
        const app = express();
        const server = http.createServer(app);

        // Config publics
            app.use(express.static('src/public'));
            // app.use(cors());
        // Config ejs
            configEngine(app)
        // parse application
            // x-www-form-urlencoded
                app.use(express.urlencoded({ extended: true }))
            // json parser
                app.use(express.json())

    // Routes
        app.use('/api', require('./routes/api.js'))
        app.use('/', require('./routes/main.js'))
        app.get('/profiles', (req, res) => {
            res.render('profiles.ejs')
        })
        app.get('/config/insert', async (req, res) => {
            let promotions = await Database.promotions.getAll()
            let categories = await Database.categories.getAll()

            res.render('config/insert.ejs', {
                categories: categories,
                promotions: promotions
            })
        })
        app.get('/config/profiles', (req, res) => {
            res.render('config/profiles.ejs')
        })
        app.get('/profile', (req, res) => {
            res.render('profile.ejs')
        })

    // Erros
        app.use((err, req, res, next) => {
            if (err instanceof Joi.ValidationError) {
                console.log(err.details)
                return res.status(500).send(err.details)
            }
            console.log(err)
            res.status(500).send({message: err.message});
        })

    // Starting Modules
    await startingModules()

    //Server
        server.listen(PORT, () => {
            console.log(` >. Server running in: ${PORT}`)
        })
}
main()