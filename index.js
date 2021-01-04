var express=require("express");
var bodyParser=require('body-parser');
var mysql      = require('mysql');
var path = require('path');
var _ = require('lodash');
var session = require('express-session');
let alert = require('alert'); 
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '1234',
   database : 'passanger'
 });
var app = express();
 
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
const { response } = require("express");
const { request } = require("http");
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   cookie: { maxAge: 8*60*60*1000 }, 
 }))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "firstpage.html" );  
})  
 
app.get("/reg",(req,res)=>
{
   res.sendFile(__dirname+"/"+"index.html") 
});
app.get('/login', function (req, res) {  
   res.sendFile( __dirname + "/" + "login.html" );  
})  
app.post("/cust",function(req,res)
{
   if(req.session.loggedin){
    var from = req.body.from,to = req.body.to,date = req.body.date;//new Date(req.body.date,"yyyy:mm:dd");
    console.log(date);
    var sql = "select * FROM trains where ? in (select city from stations) and ? in (select city from stations)"
    connection.query(sql,[from,to], function (err, data, fields) {
      if (err) throw err;
      res.render('trains', { title: 'trains', userData: data,date:date,from:from,to:to});
    });
   }else
   {
      alert('Please Login or Register to proceed furthur!');
      res.redirect('/');
   }
})
app.post('/avlakki',(req,res)=>
{
   if(req.session.loggedin){
      var from = req.body.search;
      var sql = "select * FROM bookings where pnr = ?"
      connection.query(sql,from, function (err, data, fields) {
        if (err) throw err;
        res.render('mybookings', { title: 'mybookings', userData: data});
      });
     }else
     {
        alert('Please Login or Register to proceed furthur!');
        res.redirect('/');
     }
});
app.get("/alltrains",function(req,res)
{
   if(req.session.loggedin){
    var from = req.body.from,to = req.body.to,date = req.body.date;//new Date(req.body.date,"yyyy:mm:dd");
    console.log(date);
    var sql = "select * FROM trains"
    connection.query(sql, function (err, data, fields) {
      if (err) throw err;
      res.render('trains', { title: 'trains', userData: data,date:date,from:from,to:to});
    });
   }else
   {
      alert('Please Login or Register to proceed furthur!');
      res.redirect('/');
   }
});

app.post("/timings",function(req,res)
{
    var t_number = req.body.t_number,date = req.body.date,from = req.body.from,to = req.body.to;//new Date(req.body.date,"yyyy:mm:dd");
    var sql = "select * from seat_type where t_number = ? and  date_ = ?";
    connection.query(sql,[t_number,date], function (err, data, fields) {
      if (err) throw err;
      res.render('tickets', { title: 'tickets', userData: data,date:date,from:from,to:to});
    });
})

app.post("/passangers",(request,response)=>
{
    var date = request.body.date,t_number = request.body.t_number,from = request.body.from,to = request.body.to,
    seat = request.body.seat;
    response.render('passangers',{title:'passangers',date:date,from:from,to:to,t_number:t_number,seat:seat})
});

app.post('/addpass',(request,response)=>
{
   var date = request.body.date,t_number = request.body.t_number,from = request.body.from,to = request.body.to,
   seat = request.body.seat,i,pnr = new Date().toISOString();

   var fare = 'select '+seat+' from fare where t_number = '+t_number;
   connection.query(fare,(err,result,fields)=>
   {
      var total_fare = request.body.numberofpass;
      for (var i in result) {
         if(result[i].sleeper)
         {
            total_fare *= result[i].sleeper;
         }else if(result[i].firstAC)
         {
            total_fare *= result[i].firstAC;
         }else if(result[i].secondAC)
         {
            total_fare *= result[i].secondAC;
         }else if(result[i].thirdAC)
         {
            total_fare *= result[i].thirdAC;
         }else {
            total_fare *= result[i].seating;
         }
     }
      var users={
         "pnr": pnr,
         "username":request.session.username,
         "t_number":t_number,
         "start_dest":from,
         "end_dest":to,
         "total_fare":total_fare
       } 
       connection.query('INSERT INTO bookings SET ?',users, function (error, results, fields) {
         if (error) {
           response.json({
               status:false,
               message:'there are some error with query'
           })
         }
       });
   });
   var seat_num = 'select '+seat+' from seat_type where t_number = '+t_number;
   var seat_number = 0;
   connection.query(seat_num,(err,result,fields)=>
   {
      for (var i in result) {
         if(result[i].sleeper)
         {
            seat_number =  result[i].sleeper;
         }else if(result[i].firstAC)
         {
            seat_number = result[i].firstAC;
         }else if(result[i].secondAC)
         {
            seat_number = result[i].secondAC;
         }else if(result[i].thirdAC)
         {
            seat_number = result[i].thirdAC;
         }else {
            seat_number = result[i].seating;
         }
     }
   //for( i = 1 ; i <= request.body.numberofpass ; i++ )
  // {
      //var fn = fullname+i,ge = age+i,gder = gender+i;
      var nop = request.body.numberofpass, pass_name1 = request.body.fullname1,
        age1=request.body.age1,
        gender1=request.body.gender1,pass_name2 = request.body.fullname2,
        age2=request.body.age2,
        gender2=request.body.gender2,pass_name3 = request.body.fullname3,
        age3=request.body.age3,
        gender3=request.body.gender3,pass_name4 = request.body.fullname4,
        age4=request.body.age4,
        gender4=request.body.gender4,pass_name5 = request.body.fullname5,
        age5=request.body.age5,
        gender5=request.body.gender5,pass_name6 = request.body.fullname6,
        age6=request.body.age6,
        gender6=request.body.gender6;
        var users1=[
         pass_name1,
         age1,
         gender1,
         pnr,
         seat_number,
         seat
        ];
       var users2=[
         pass_name2,
         age2,
         gender2,
         pnr,
         seat_number,
         seat
       ]; 
       var users3=[
         pass_name3,
         age3,
         gender3,
         pnr,
         seat_number,
         seat
       ];
       var users4=[
         pass_name4,
         age4,
         gender4,
         pnr,
         seat_number,
         seat
       ];
       var users5=[
          pass_name5,
         age5,
         gender5,
         pnr,
         seat_number,
         seat
       ];
       var users6=[
          pass_name6,
         age6,
         gender6,
         pnr,
         seat_number,
         seat
       ];
       var passers = [];
        if(nop == 1)
        {
         passers.push(users1);
         seat_number--;
        }
        else if( nop == 2)
        {
          passers.push(users1);
          passers.push(users2);
          seat_number--;    
          seat_number--;
        }else if(nop == 3)
        {
         passers.push(users1);
         passers.push(users2);
         passers.push(users3);
         seat_number--;
         seat_number--;
         seat_number--;
        }else if(nop == 4)
        {
         passers.push(users1);
         passers.push(users2);
         passers.push(users3);
         passers.push(users4);
         seat_number--;
         seat_number--;
         seat_number--;
         seat_number--;
        }else if(nop == 5)
        {
         passers.push(users1);
         passers.push(users2);
         passers.push(users3);
         passers.push(users4);
         passers.push(users5);
         seat_number--;
         seat_number--;
         seat_number--;
         seat_number--;
         seat_number--;
        }else if( nop == 6 )
        {
         passers.push(users1);
         passers.push(users2);
         passers.push(users3);
         passers.push(users4);
         passers.push(users5);
         passers.push(users6);
         seat_number--; 
         seat_number--;    
         seat_number--;
         seat_number--;
         seat_number--;
         seat_number--;
        }
         var sql1 = "INSERT INTO passangers (pass_name, age, gender,pnr,seat_no,coach) VALUES ?";
         connection.query(sql1, [passers], function(err,results) {
         if (err) throw err;
           //connection.end();
         });
        var sql2 = 'update seat_type set '+seat+' = '+seat_number+' where t_number = '+t_number;
        connection.query(sql2,(err,result)=>
        {
           if(err)throw err;
        });
        var sql3 = 'select b.*,t.train_name from bookings b,trains t where b.t_number = t.t_number order by pnr desc limit 1';
        connection.query(sql3,(err,result)=>{
           if(err) throw err;
           response.render('mybookings',{title:'mybookings',userData:result});
        })
});
});

app.get('/mybookings',(request,response)=>{
   if(request.session.loggedin)
   {
       var sql = 'select b.*,t.train_name from bookings b,trains t where b.username = ? and b.t_number = t.t_number';
       connection.query(sql,request.session.username,(err,result)=>
       {
          if(err)throw err;
          response.render('mybookings',{title:'mybookings',userData:result})
       })
   }
   else{
       response.redirect('/');
   }
});

app.post('/fromto',(request,response)=>
{
   var pnr = request.body.pnr;
   var sql = 'select * from passangers where pnr = ?';
   connection.query(sql,pnr,(err,result,fields)=>
   {
      if(err)throw err;
      response.render('fromto',{title:'fromto',userData:result})
   })
})

/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.listen(8012);
