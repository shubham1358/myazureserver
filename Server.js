var express = require('express');
var app = express();
var sql = require('mssql');
var cors = require('cors');
var session = require('express-session');
var passport = require('passport');
//constants
const life = 1000 * 60;
var whitelist = ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:55024/','https://reactwe20200523085359.azurewebsites.net/']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'application/json']
    
}
app.use(cors(corsOptions));
//const ipassport = require('./passportconfig');
//ipassport(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'cateyes',
    cookie: {
        secure: false,
        httpOnly: false
    },
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// config for your database
var config = {
    user: 'dsejadmin',
    password: 'masterpassword',
    server: 'localhost',
    database: 'Dsej'
};

var requestTime = function (req, res, next) {
    req.session.uuid = 5;
    console.log('middeware');
    next();
}

//Session true
app.get('/api/valid', function (req, res) {
    console.log('valid session id ' + req.sessionID + '  '+ req.session.uuid);
   // req.session.uuid = 'hey';
    
    if (req.session.uuid) {
        
        res.send(true);
    }
    else {
       
        console.log('sed false uuid is ' + req.session.uuid);
        req.session.uuid = 0;
        res.send(false);
    }
   //    next();
});


//connect to database on my and send data
app.get('/my', function (req, res, next) {
  
    console.log(req.session.uuid);
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select SchoolName from UdsieApplication where UdiseNo=1', function (err, recordset) {

            if (err) console.log(err);

            // send records as a response
            else
                res.json(recordset.recordset);
           
            sql.close();
        });

    });
    next();
});


//create column
app.post('/api/me/create', function (req, res) {

   // res.setHeader('Access-Control-Allow-Credentials', 'true');
   // res.setHeader("Content-Type", "text/html");
    console.log(req.body);
    console.log('Create sessionid ' + req.sessionID);
    
    
    console.log('session : ' + req.session.uuid +' udise no. : ' +  req.body.udiseno);
    sql.connect(config, function (err) {
        
       
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        
        // query to the database and get the records
        request.query(`insert into UdsieApplication (UdiseNo,ManagApproval,UdiseNoSubmit,Password) values (${req.body.udiseno},${req.body.managapproval},1,${req.body.password})`, function (err, recordset) {

            if (err) console.log(err);

            // send records as a response
            else {
                
                
                req.session.uuid = req.body.udiseno;
                req.session.save(function (err) {
                    // session saved
                })
                console.log('session uuid is '+ req.session.uuid);
                res.send(true);
            }
            sql.close();
        });
    });
   
    
});


//valid send
app.get('/api/validsend', (req, res) => {
    if (req.session.uuid) {
        sql.connect(config, function (err) {

            if (err) console.log(err);

            // create Request object
            var request = new sql.Request();

            // query to the database and get the records
            request.query(`select UdiseNo from UdsieApplication where UdiseNo=${req.session.uuid}`, function (err, recordset) {

                if (err) console.log(err);

                // send records as a response
                else
                    res.json({
                        udiseno: recordset.recordset[0].UdiseNo,
                        isess: true
                    });

                sql.close();
            });

        });
        
    }
    else
        res.json({ isess: false });
});

//signin
app.post('/api/signin', (req, res) => {
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query(`select UdiseNo,Password from UdsieApplication where UdiseNo=${req.body.login}`, function (err, recordset) {

            if (err) {

                console.log(err);
                res.send(false);
            }

            // send records as a response
            else {
                console.log('password : ' + JSON.stringify(recordset.recordset[0].Password));
                if (req.body.pwd == recordset.recordset[0].Password) {
                    console.log(req.session.uuid);
                 req.session.uuid = req.body.login;
                   
                   
                    res.send(true);
                }
            }

            sql.close();
        });

    });
});




//update new row
app.post('/api/mem/update', (req, res, next) => {
   
    
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        var j = req.body;
        const k = 1;
        console.log('SkoolNAme: ');
        console.log(j.skoolname); 
        // query to the database and get the records
        request.query(`update mytable set name = '${req.body.skoolname}' where id=${k}`, function (err, recordset) {

            if (err) console.log(err);

            // send records as a response
            else
                res.send('Updated Sucessfully');
            sql.close();
        });
    });
  
});


app.listen(5002, function () {
    console.log('Server is running.. at 5002 ');
});