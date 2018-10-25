const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt-nodejs");
const cors = require('cors');
const User = require('./models/user');
const mongoose = require('mongoose');

const router = express();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json())
router.use(express.static(__dirname + '/public'));
router.use(cors());

mongoose.connect('mongodb://localhost/users_api');


// const pictureSchema = new mongoose.Schema({
//   image: String,
//   author_name: String,
//   author_image: String,
//   created: String,
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//   },
// });

// let data =  {
//   user_id: '2018',
//   name: 'kwame',
//   email: 'admin@alosoft.net',
//   password: 'twum',
//   entries: 0,
//   joined: new Date().toDateString()
// };

// User.create(data, function(err, newUser) {
//     if (err){
//       console.log(err)
//     } else {
//       console.log(newUser);
//     }
//   }
// );


// User.find({}, function (err, picture) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(picture);
//   }
// });

// const database = {
//   users: [
//     {
//       id: '2018',
//       name: 'kwame',
//       email: 'admin@alosoft.net',
//       password: 'twum',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: '2000',
//       name: 'raymond',
//       email: 'admin@alosoft.net',
//       password: 'agyei',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: '1994',
//       name: 'alonso',
//       email: 'user@alosoft.net',
//       password: 'alonso20',
//       entries: 0,
//       joined: new Date()
//     }
//   ]
// };

router.get('/', (req, res) => {
  // res.send(database.users);
  User.find({}, function (err, picture) {
    if (err) {
      console.log(err);
    } else {
      res.send(picture);
    }
  });
});


router.post('/signin', (req, res) => {

  const {email, password} = req.body;
  console.log('password from body', password);


  bcrypt.compare(password, "$2a$10$W7.IAzi30p5ho91cR54iq.j6knnjKR0Qn7jt4OgSv3yt.R5Gea4Nu", (err, answer) => {
    console.log(typeof(answer));
  });

  User.find({}, function (err, picture) {
    if (err) {
      console.log(err);
      res.status(400).json('error logging in');
    } else {
      const found = picture.filter(item => email === item.email);
      console.log(typeof(found[0].password));
      console.log('password from database', found[0].password);


      if (found.length > 0) {

        console.log('FOUND');
        console.log(found);

        bcrypt.compare(password, found[0].password, (err, answer) => {
          if (answer) {
            console.log('answer', answer);
            console.log('correct password');
            res.json(found);
          } else {
            console.log('error from bcrypt', err);
            res.json('error logging in');
          }
        });

        // res.json('success');
        // res.json(found);
      } else {
        console.log('error logging in');
        res.status(400).json('error logging in');
      }
    }
  });

  // Load hash from your password DB.
  // bcrypt.compare("bacon", hash, function(err, res) {
  //   res == true
  // });

  // const {password} = req.body;

  // bcrypt.compare('cookies', '$2a$10$SC06JT/ECqFX/VDJ3NK6bujDKmJ8D9v67jDNKTyn6xNGvJ.mEBsJm', (err, res) => {
  //   console.log('first guess', res)
  // });
  // bcrypt.compare('jelly bean', '$2a$10$SC06JT/ECqFX/VDJ3NK6bujDKmJ8D9v67jDNKTyn6xNGvJ.mEBsJm', (err, res) => {
  //   console.log('first guess', res)
  // });

  // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
  //   res.json('success');
  // } else {
  //   res.status(400).json('error logging in');
  // }
});

// const user = () => {
// const userHash = bcrypt.hash('alonso', null, null, (err, hash) => {
//   return hash;
// });
//
// console.log(userHash);
// }

// const pass = bcrypt.hashSync('love');
// console.log(bcrypt.compareSync('love', pass));
// console.log(pass);

// console.log(data);

router.post('/register', (req, res) => {
  const {email, name, password, user_id} = req.body;


  User.find({}, function (err, picture) {
    const exist = picture.filter(item => item.email === email);
    console.log(exist, Boolean(exist), 'length is ', exist.length);

    if (Boolean(exist.length)) {
      console.log('error logging in (email already exist)');
      res.json('email exist');
    } else {

      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          console.log('error hashing password');
          res.json('error registering(hashing)');
        } else {
          console.log('hashing password....');
          User.create({
              user_id: user_id,
              name: name,
              email: email,
              password: hash,
              entries: 0,
              joined: new Date().toDateString()
            },
            function (err, newUser) {
              if (err) {
                console.log(err);
                res.json('error registering(saving)');
              } else {
                console.log(newUser);
                res.json(newUser);
              }
            }
          );

        }
      })

    }

  });

  // let userPassword;
  //
  // bcrypt.hash(password, null, null, (err, hash) => {
  //   console.log(hash);
  //   userPassword = hash;
  // });

  // database.users.push(
  //   {
  //     id: id,
  //     name: name,
  //     email: email,
  //     password: password,
  //     entries: 0,
  //     joined: new Date()
  //   }
  // );
  // const hash = bcrypt.hashSync(password);


});


router.get('/profile/:user_id', (req, res) => {

  const {user_id} = req.params;
  // let found = false;
  console.log(req.params);

  User.find({user_id: user_id}, function (err, picture) {
    if (err) {
      console.log(err);
      res.status(400).json('not found');

    } else {
      console.log(picture);
      res.json(picture);
    }
  });


});


// var query = { name: 'borne' };
// Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

router.put('/image', (req, res) => {

  const {body} = req;
  console.log('body from front end', req.body);

  const query = {'_id': body._id};

  User.findOneAndUpdate(query, req.body, function (err, picture) {
    if (err) {
      console.log(err);
      res.status(400).json('not found');

    } else {
      console.log('find and update object =>', picture);

      User.find(query, function (err, picture) {
        if (err) {
          console.log(err);
          res.status(400).json('not found');

        } else {
          console.log('find object after update', picture);
          res.json(picture[0].entries);
        }
      });
    }

  });

});


module.exports = router;
// module.exports = mongoose.model("User", UserSchema);

/*
  / --> POST = success/fail
  /register --> POST  = user
  /profile/:userId --> GET = user
  /image --> PUT = user
 */