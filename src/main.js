require('dotenv').config()
const express = require("express");
// const http = require('http');
const Joi = require('joi');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const session = require('express-session')

const configEngine = require("./config/viewEngine.js");
const Database = require("./functions/queryDB.js");
const { includeJWTInHeader } = require('./middleware/jwt.js');
const { deserializeUser } = require('./middleware/deserializeUser.js')

async function startingModules() {
    console.log(" >. starting modules")
    console.log(await Database.testConnect())
}

const main = async () => {
    // Variables
    //const PORT = process.env.PORT || 4000

    // Config server
    const app = express();
    // const server = http.createServer(app);

    // Config publics
    app.use(express.static('src/public'));
    app.use(cors({
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        origin: true
    }));
    
    // Config ejs
    configEngine(app)
    // parse application
    // x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }))
    // json parser
    app.use(express.json())
    //config cookie
    app.use(cookieParser());

    app.use(session({
        name: 'accessTokenSession',
        secret: process.env.SECRET,
        cookie: {
            maxAge: 15 * 60 * 1000, // 15 min
            httpOnly: true,
            // domain: process.env.production ? "https://zahir-website.onrender.com": "localhost",
            path: "/",
            sameSite: "none",
            secure: true
        },
        saveUninitialized: false,
        resave: true
    }))

    app.use((req, res, next) => {
        next()
    })

    // Routes
    app.use('/api', deserializeUser, require('./routes/apiAuthGoogle.js'))
    app.use('/api', includeJWTInHeader, require('./routes/api.js'))
    app.use('/', includeJWTInHeader, require('./routes/main.js'))

    // Erros
    app.use((err, req, res, next) => {
        if (err instanceof Joi.ValidationError) {
            console.log(err.details)
            return res.status(500).send(err.details)
        }
        console.log(err)
        res.status(500).send({ message: err.message });
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