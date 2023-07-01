module.exports = {
    index: (req, res) => {
        return res.render('index.ejs')
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