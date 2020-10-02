const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
//firebase admin 
const admin = require('firebase-admin');

const port = 5000

const app = express()

app.use(cors());
app.use(bodyParser.json());


var serviceAccount = require("./ema-john-simple-auth-firebase-adminsdk-xnr2p-28fabcb97f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ema-john-simple-auth.firebaseio.com"
});

const pass = "2204AYshi1999";


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ayshiray:2204AYshi1999@cluster0.jmmpi.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booking = client.db("burjAlArab").collection("bookings");

  //create a data & insert into database
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    booking.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
        //console.log(result);
      })
    console.log(newBooking);
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    console.log(bearer);
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log({ idToken });
      admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
          let uid = decodedToken.uid;
          console.log(uid)
          // ...
        }).catch(function(error) {
          console.log(error);
          // Handle error
        });
      
    }




    // booking.find({email: req.query.email})
    // .toArray((err, documents) => {
    //   res.send(documents)
    // })

  })

  console.log('database connected successfully');
  //client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)