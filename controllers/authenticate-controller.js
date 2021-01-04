var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var path = require('path');
var app = express();
var mysql      = require('mysql');
var popup = require('alert');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'passanger'
});

app.use(session(
  {
      secret : 'secret key' , 
      resave : false , 
      saveUninitialized : false , 
  }
))

module.exports.authenticate=function(request,response){
    var username=request.body.username;
    var password=request.body.passkey;
   
   
    if (username && password) {
      // check if user exists
            connection.query('SELECT * FROM users WHERE username = ? AND passkey = ?', [username, password], function(error, results, fields) {
                if (results.length > 0) {
                   request.session.loggedin = true;
                   request.session.username = username;
                   response.redirect('/');
                } else {
                    popup('Incorrect Username and/or Password!');
                    response.redirect('/login')
                }           
                response.end();
            });
        } else {
            popup('Please enter Username and Password!');
            response.end();
        }
}
