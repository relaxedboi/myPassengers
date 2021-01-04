var express=require("express");
//var connection = require('./../config');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'passanger'
});
module.exports.register=function(req,res){
    var users={
        "userName":req.body.username,
        "passKey":req.body.passkey,
        "firstName":req.body.firstname,
        "lastName":req.body.lastname,
        "email":req.body.email,
        "ph_number":req.body.ph_number
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
        res.redirect('/');
      }
    });
}