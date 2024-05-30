require('dotenv').config()
const express = require("express");
const http = require('http');
const Joi = require('joi');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const configEngine = require("./config/viewEngine.js");
const Database = require("./functions/queryDB.js");
const { includeJWTInHeader } = require('./middleware/jwt.js');

async function startingModules() {
    console.log(" >. starting modules")
    console.log(await Database.testConnect())
}

const main = async () => {
    // Variables
        //const PORT = process.env.PORT || 4000
    
    // Config server
        const app = express();
        const server = http.createServer(app);

        // Config publics
            app.use(express.static('src/public'));
            app.use(cors());
        // Config ejs
            configEngine(app)
        // parse application
            // x-www-form-urlencoded
                app.use(express.urlencoded({ extended: true }))
            // json parser
                app.use(express.json())
        //config cookie
            app.use(cookieParser());

    // Routes
        app.use('/api', require('./routes/apiAuthGoogle.js'))
        app.use('/api', includeJWTInHeader, require('./routes/api.js'))
        app.use('/', includeJWTInHeader, require('./routes/main.js'))

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

    return app;

    //Server
        //server.listen(PORT, () => {
        //    console.log(` >. Server running in: ${PORT}`)
        //})
}
module.exports = main()