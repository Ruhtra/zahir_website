const Database = require("../functions/queryDB.js");

module.exports = {
    index: async (req, res) => {

        let data = await Database.profile.recents()

        console.log(data);

        return res.render('index.ejs', {
            recents: data
        })
    },
    test: (req, res) => {
        return res.render('test.ejs')
    },
    profile: (req, res) => {
        return res.render('profile.ejs')
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
    }
}