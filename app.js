const express = require('express');
const app = express();
const firebase = require('firebase');
const firebaseConfig = require('./firebseConfig');


// Initialize Firebase
app.set("view engine",'ejs')
firebase.initializeApp(firebaseConfig);
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
// Set up middleware for Firebase authentication
const authMiddleware = (req, res, next) => {
  const user = firebase.auth().currentUser;

  if (user) {
    req.user = user;
    next();
  } else {
    res.redirect('/login');
  }
};

 app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  
  // app.get('*', (req, res) => {
  //   res.render('layout',{});
  // });
    

// Set up routes for authentication
app.get('/login', (req, res) => {
  // res.render('login.ejs');
  res.render('layout',{body:'login'});
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email,password,"hello")

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/login');
    });
});

app.get('/register', (req, res) => {
  // res.render('register.ejs');
  res.render('layout',{body:'register.ejs'});
});

app.post('/register', (req, res) => {
  console.log(req.body)
  const email = req.body.email;
  const password = req.body.password;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      console.error(error);
      res.redirect('/register');
    });
});

// Set up route for live canteen status
app.get('/', (req, res) => {
    // Retrieve live canteen status data from Firebase database
    // const itemsRef = firebase.database().ref('items');
    // itemsRef.on('value', (snapshot) => {
    //   const items = snapshot.val();
    //   res.render('live-canteen', { items });
      
    // }, (error) => {
    //   console.log('Error fetching live canteen status data: ', error);
    //   // res.render('live-canteen', { items: [] });
      res.render('layout',{body:'live-canteen',items: []});
    // });
  });
 

// Start the server
app.listen(3000, () => {
console.log('Server started on port 3000');
});
