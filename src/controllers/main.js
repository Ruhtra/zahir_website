const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
const f = require("../functions/functions.js")

module.exports = {
    index: async (req, res) => { 
        return res.render('index.ejs', {
            homePage: f.shuffle(await Database.homePage.get()),
            recents: await Database.profile.recents(),
            permission: req.permission
        })
    },
    test: (req, res) => {
        return res.render('test.ejs', {
            permission: req.permission
        })
    },
    profile: async (req, res) => {
        const {error, value} = validate.profile.id(req.query.id)
        if (error) throw error

        return res.render('profile.ejs', {
            profile: (await Database.profile.get(value))[0],
            permission: req.permission
        })
    },
    profiles: (req, res) => {
        return res.render('profiles.ejs', {
            permission: req.permission
        })
    },
    config: {
        profiles: (req, res) => {
            return res.render('config/profiles.ejs', {
                permission: req.permission
            })
        },
        homePage: (req, res) => {
            return res.render('config/homePage.ejs', {
                permission: req.permission
            })
        }
    },
    authenticator: {
        login: (req, res) => {
            return res.render('login.ejs', {
                permission: req.permission
            })
        }
    }
}