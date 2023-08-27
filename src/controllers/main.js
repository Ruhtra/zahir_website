const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");

module.exports = {
    index: async (req, res) => { 
        return res.render('index.ejs', {
            homePage: await Database.homePage.get(),
            recents: await Database.profile.recents()
        })
    },
    test: (req, res) => {
        return res.render('test.ejs')
    },
    profile: async (req, res) => {
        const {error, value} = validate.profile.id(req.query.id)
        if (error) throw error

        return res.render('profile.ejs', {
            profile: (await Database.profile.get(value))[0]
        })
    },
    profiles: (req, res) => {
        return res.render('profiles.ejs')
    },
    config: {
        profiles: (req, res) => {
            return res.render('config/profiles.ejs')
        },
        homePage: (req, res) => {
            return res.render('config/homePage.ejs')
        }
    },
    authenticator: {
        login: (req, res) => {
            return res.render('login.ejs')
        }
    }
}