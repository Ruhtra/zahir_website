require('dotenv').config()
const express = require("express");
const http = require('http');
var bodyParser = require('body-parser');

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
        // Config ejs
            configEngine(app)
        // parse application
            // x-www-form-urlencoded
                // app.use(bodyParser.urlencoded({ extended: false }))
            // json parser
                app.use(bodyParser.json())

    // Routes
        app.use('/api', require('./routes/api.js'))
        app.use('/', require('./routes/main.js'))
        app.get('/profiles', (req, res) => {
            res.render('profiles.ejs')
        })
        app.get('/profile', (req, res) => {
            res.render('profile.ejs')
        })

    // Erros
        app.use((err, req, res, next) => {
            console.log('error middleware');
            console.log(err)
            res.sendStatus(500);
        })

    // Starting Modules
    await startingModules()

    //Server
        server.listen(PORT, () => {
            console.log(` >. Server running in: ${PORT}`)
        })
}
main()