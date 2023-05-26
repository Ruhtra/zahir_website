module.exports = (app) => {
    app.set('view engine', 'ejs')
    app.set('views', './src/views')
    app.set('view cache', true);
}