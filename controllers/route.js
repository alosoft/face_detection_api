const handleAll = (req, res, Database) => {
  // res.send(database.users);
  Database.find({}, function (err, picture) {
    if (err) {
      console.log(err);
    } else {
      res.send(picture);
    }
  });
};

const handleSignIn = (req, res, Database, User, bcrypt) => {
  const {email, password} = req.body;
  console.log('password from body', password);
  console.log(req.body);

  if (email && password) {
    User.find({}, function (err, picture) {
      console.log('first line');
      if (err) {
        console.log('picture');
        console.log(err);
        res.status(400).json('error logging in');
      } else {
        const found = picture.filter(item => email === item.email);
        // console.log(typeof(found[0].password));
        // console.log('password from database', found[0].password);


        if (found.length > 0) {

          console.log('FOUND');
          console.log(found);

          bcrypt.compare(password, found[0].password, (err, answer) => {
            if (answer) {
              console.log('answer', answer);
              console.log('correct password');
              Database.find({email: found[0].email}, (err, item) => {
                if (err) {
                  console.log('error finding email after password check success', err);
                } else {
                  res.json(item);
                }
              });
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
  } else {
    res.json('empty fields');
  }

};


const handleRegister = (req, res, User, Database, bcrypt) => {
  console.log(req.body);
  const {email, name, password, user_id} = req.body;

  if (email && name && password){
    Database.find({}, function (err, picture) {
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
              email: email,
              password: hash
            }, (err) => {
              if (err) {
                console.log(err);
                res.json('error creating user');
              }
            });
            Database.create({
                user_id: user_id,
                name: name,
                email: email,
                // password: hash,
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


      // });

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


    })
  } else {
    res.json('empty fields');
  }


};



const handleProfile = (req, res, Database) => {

  const {user_id} = req.params;
  // let found = false;
  console.log(req.params);

  Database.find({user_id: user_id}, function (err, picture) {
    if (err) {
      console.log(err);
      res.status(400).json('not found');

    } else {
      console.log(picture);
      res.json(picture);
    }
  });


};


const handleImage = (req, res, Database) => {

  const {body} = req;
  console.log('body from front end', req.body);

  const query = {'_id': body._id};

  Database.findOneAndUpdate(query, req.body, function (err, picture) {
    if (err) {
      console.log(err);
      res.status(400).json('not found');

    } else {
      console.log('find and update object =>', picture);

      Database.find(query, function (err, picture) {
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

};



module.exports  = {
  handleAll: handleAll,
  handleSignIn: handleSignIn,
  handleRegister: handleRegister,
  handleProfile: handleProfile,
  handleImage: handleImage
};