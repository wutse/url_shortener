'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const routers = require('./routes');

require('./config/mongoose');

const app = express();
const port = 3000;

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(routers);

app.listen(port, () => {
  console.log(`url shortener start at ${(new Date()).toLocaleString()}.`);
});