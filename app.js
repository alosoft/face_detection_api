const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt-nodejs");
const cors = require('cors');
const Database = require('./models/database');
const User = require('./models/user');
const mongoose = require('mongoose');

const route = require('./controllers/route');


const router = express();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json())
router.use(express.static(__dirname + '/public'));
router.use(cors());

mongoose.connect('mongodb://localhost/users_api');


router.get('/', (req, res) => {route.handleAll(req, res, Database)});


router.post('/signin', (req, res) => {route.handleSignIn(req, res, Database, User, bcrypt)});


// router.post('/register', (req, res) => {handle.register(req, res, Database, User, bcrypt)});
router.post('/register', (req, res) => {route.handleRegister(req, res, Database, User, bcrypt)});



router.get('/profile/:user_id', (req, res) => {route.handleProfile(req, res, Database)});


// var query = { name: 'borne' };
// Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

router.put('/image', (req, res) => {route.handleImage(req, res, Database)});


module.exports = router;
// module.exports = mongoose.model("User", UserSchema);

/*
  / --> POST = success/fail
  /register --> POST  = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */