// Express modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');                        //Used for logging
const path = require("path");
const bcrypt = require('bcryptjs');
const multer = require('multer');                        //Handling multipart/form data
const ejs = require('ejs');


//Set storage Engine

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
      cb(null,file.fieldname + '-' +Date.now() + path.extname(file.originalname));
    }

})

//Init upload
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }

}).single('myImage')


function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}



// Template modules
const mustache = require('mustache');                        // Logic Less Template
const fs = require('fs');                                    // File Systems


// Database modules
const db = require('./user');
const sequelize = db.sequelize;
const User = db.User;
const Album = db.Album;
const Photo = db.Photo;

const app = express();

// Set view engine as pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/views"));



app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: "user_sid",
  secret: "blahblah",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 2
  }
}));


app.post('/upload', (req,res) =>{
  
  upload(req,res,(err) => {
    Photo.create({
      photo_name: req.body.name,
      photo_desc: req.body.desc,
      album: req.body.albumname,
      file_name: req.file.filename
    }).then(photo => {
      console.log(`Added new photo!`);
    })
    .catch(err => {
      console.log(err);
    });
    return res.redirect('/dashboard')

  });



});


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.cookie('user_sid', "", {
      expires: new Date()
    });
  }
  next();
});


// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

app.use(express.static('public'));

app.get('/', sessionChecker, (req, res) => {
  res.sendFile("index.html");
});


app.get('/', function(req, res)  {
  res.sendFile("edit_profile.html");
});

app.post('/changes', function(req, res){
        const salt = bcrypt.genSaltSync();
        let pass = bcrypt.hashSync(req.body.password,salt);
        User.update({
          firstname: req.body.firstname, 
          lastname: req.body.lastname,
          email: req.body.email,
          password: pass
          },
          {
            where:{
              username: req.session.user
            }
          }
        )
        return res.redirect('/dashboard');
        });
        

    


// Route for new user signup
app.route('/signup')
  .get(sessionChecker, (req, res) => {
    let datasend = {
      errorMessage: ""
    };
    let page = fs.readFileSync("public/signup.html", "utf8");
    let html = mustache.to_html(page, datasend);
    res.send(html);
  })
  .post((req, res) => {
    let gender;
    if (req.body.gender == 1) {
      gender = "male"
    } else if (req.body.gender == 2) {
      gender = "female"
    }
    User.create({
        username: req.body.user,
        email: req.body.email,
        password: req.body.pass,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: gender
      })
      .then(user => {
        req.session.user = user.username;
        res.redirect('/dashboard');
      })
      .catch(err => {
        console.log(err);
        let datasend = {
          errorMessage: "Username Or E-mail already exists. Try Again."
        };
        let page = fs.readFileSync("public/signup.html", "utf8");
        let html = mustache.to_html(page, datasend);
        res.send(html);
      });
  });

// route for user Login
app.route('/login')
  .get(sessionChecker, (req, res) => {
    let datasend = {
      errorMessage: ""
    };
    let page = fs.readFileSync("public/login.html", "utf8");
    let html = mustache.to_html(page, datasend);
    res.send(html);
  })
  .post((req, res) => {

    let username = req.body.user,
      password = req.body.pass;
    User.findOne({
      where: {
        username: username
      }
    }).then(function (user) {
      if (!user) {
        let datasend = {
          errorMessage: "Username and password do not match"
        };
        let page = fs.readFileSync("public/login.html", "utf8");
        let html = mustache.to_html(page, datasend);
        res.send(html);
      } else if (!user.validPassword(password)) {
        let datasend = {
          errorMessage: "Username and password do not match"
        };
        let page = fs.readFileSync("public/login.html", "utf8");
        let html = mustache.to_html(page, datasend);
        res.send(html);
      } else {
        req.session.user = user.username;
        res.redirect('/dashboard');
      }
    });
  });


app.get('/profile', (req, res) => {
  User.findOne({
    attributes: ["firstname", "lastname", "email", "gender", "createdAt"],
    where: {
      username: req.session.user
    }
  }).then(result => {
    let datasend = {
      username: req.session.user,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      gender: result.gender,
      createdat: result.createdAt
    };
    let page = fs.readFileSync("public/profile.html", "utf8");
    let html = mustache.to_html(page, datasend);
    res.send(html);
  })
});

// route for user logout
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    req.session.destroy();
    res.cookie('user_sid', "", {
      expires: new Date()
    });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

// Route for user's dashboard
app.route('/dashboard')
  .get((req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render("album");
    } else {
      res.redirect('/login');
    }
  });

app.get("/albumData", (req, res) => {
  Album.findAll({
    attributes: ["album_name", "album_desc", "createdAt"],
    where: {
      user: req.session.user
    }
  }).then(records => {
    let data = {}
    if (records)
      data = JSON.stringify(records);
    res.send(data);
  }).catch(err => {
    console.error(`ERROR ${err}`);
  });
});

app.post("/addAlbum", (req, res) => {
  Album.create({
      album_name: req.body.albumName,
      album_desc: req.body.albumDesc,
      user: req.session.user
    }).then(album => {
      console.log(`Added new album!`);
    })
    .catch(err => {
      console.log(err);
    });
})

app.get('/dashboard/:albumName', (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    Album.findOne({
      where: {
        user: req.session.user,
        album_name: req.params.albumName
      }
    }).then((album) => {
      console.log(album);
      if (!album) {
        res.redirect('/dashboard');
      } else {
        res.render("photos", {
          albumName: req.params.albumName
        });
      }
    }).catch(err => {
      console.log(`ERROR ${err}`);
    });
  } else {
    res.redirect("/login");
  };
});

app.get("/photoData/:albumName", (req, res) => {
  Photo.findAll({
    attributes: ["photo_name", "photo_desc", "createdAt","file_name"],
    where: {
      album: req.params.albumName
    }
  }).then(records => {
    let data = {}
    if (records)
      data = JSON.stringify(records);
    res.send(data);
    console.log(data);
  }).catch(err => {
    console.error(`ERROR ${err}`);
  });
});

app.post("/addPhoto", (req, res) => {
  Photo.create({
      photo_name: req.body.photoName,
      photo_desc: req.body.photoDesc,
      album: req.body.albumName
    }).then(photo => {
      console.log(`Added new photo!`);
    })
    .catch(err => {
      console.log(err);
    });
})

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Sorry some error happened!');
});

// Start server on given PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
