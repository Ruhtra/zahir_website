const express = require("express");
const http = require('http');

const configEngine = require('./config/viewEngine.js')

// Variables
const PORT = 4000

// Config server
const app = express();
const server = http.createServer(app);

const main = async () => {
    console.log('> Starting Modules...')
    //console.log(await Database.connect())
    // Config
        app.use(express.static('src/public'));
        configEngine(app)
    //    app.use(cors())
    //    app.use(express.urlencoded({ extended: true }))
    // Routes
        app.get('/', (req, res) => {
            res.render('index.ejs')
        })
    // Errors
    //    app.use(function(err, req, res, next){
    //        console.log(err)
    //        res.status(500).send({ message: 'Erro interno do server' })
    //    })

    app.listen(PORT, () => {
        console.log(`> Running in port ${PORT}`)
    })
}

main().catch(console.error)