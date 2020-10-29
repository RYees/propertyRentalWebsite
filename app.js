var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');
var fs = require('fs');
var multer = require('multer');
var admin = require("firebase-admin");

const mongoose = require('./config/mongoose');
const { jwt_key, port } = require('./config/vars');
const { routes } = require('./config/routes');

const { hasPermissions } = require('./middlewares/auth');

/*/var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://propertyrental-a9ade.firebaseio.com"
});

 
const payload = {
    notification: {
      title: 'Notification Title',
      body: 'This is an example notification',
    }
  };
 
  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24, // 1 day
  };
 
  firebase.messaging().sendToDevice(firebaseToken, payload, options);/*/


var bauthRouter = require('./routes/bauth');
var AauthRouter = require('./routes/Aauth');
var brokerRouter = require('./routes/broker');
var propertyRouter = require('./routes/property');
var commentRouter = require('./routes/comment');
var adminRouter = require('./routes/admin');



var app = express();


// open mongoose connection
mongoose.connect();

app.use(logger('dev'));
app.use('/public',express.static('public/images'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/property',propertyRouter);
app.use('/comment', commentRouter);

app.use(jwt({ secret: jwt_key, algorithms: ['HS256']})
.unless({path: routes.public})); // Auth


// login information state

app.use('/broker',brokerRouter);
app.use('/bauth', bauthRouter);
app.use('/admin', adminRouter);
app.use('/Aauth', AauthRouter);


module.exports = app;
