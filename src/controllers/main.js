module.exports = {
    index: (req, res) => {
        return res.render('index.ejs')
    },
    profile: (req, res) => {
        return res.render('profile.ejs')
    },
    // config
    profiles: (req, res) => {
        return res.render('config/profiles.ejs')
    },
    homePage: (req, res) => {
        return res.render('config/homePage.ejs')
    }
}