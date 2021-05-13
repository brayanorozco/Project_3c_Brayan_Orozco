const mysql = require('mysql');
const { request } = require('express');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');


 app.use(express.urlencoded({
   extended:true
 }));

// First you need to create a connection to the database

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app_db'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});




//Creating routes

app.get('/',(req,res) => {
  let sql = 'SELECT * FROM schedule ORDER BY id_user asc';
   con.query(sql,(err,results) =>{
      if(err) throw err;
       console.log(results);
       res.render('schedule',{schedules:results,days,title:'Schedules'});
  })
});

app.get('/new', function (req, res) {
  res.render('addSchedule', {days,title: "Add New Schedule"
  });
});

app.post('/new',(req,res)=>{

  console.log(req.body);

    let userName = req.body.username;
    let day = req.body.day;
    let start = req.body.start;
    let end = req.body.end;
      con.query('INSERT INTO schedule(username,days,start,end) VALUES(?,?,?,?)',
      [userName,day,start,end],function(err)
      {
              if (err) {
                return console.log(err.message);
              }
              console.log("New schedule has been added");
              
              res.redirect("/")
              
      
     });
  
});

app.listen('3001',()=>{
  console.log('server started on port 3001');
});


//Brayan