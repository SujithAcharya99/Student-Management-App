const express = require('express');
require('./db/mongoose');
const path = require('path');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const studentRouter = require('./routers/studentroutes');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname,'../views/views');
const partialsPath = path.join(__dirname,'../views/partials')

// const viewsPath = path.join(__dirname,'../views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath));
app.use(studentRouter);
app.use(express.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log('server is up on port:' + port);
});