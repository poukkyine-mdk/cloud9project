/* Connection to Cassandra */
"use strict";
const cassandra = require('cassandra-driver');
var createKsQuery = "CREATE KEYSPACE kmd_blackboard WITH REPLICATION = {  'class' : 'NetworkTopologyStrategy',  'datacenter1' : 1 } ;";
const client = new cassandra.Client({
    contactPoints: ['172.18.0.2']
});
client.connect()
    .catch(function(err) {
        console.error('There was an error when connecting', err);
        return client.shutdown();
    });

/* ************************************************** */
/* Require packages, set up a few things */
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    session = require("express-session");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(session({
    secret: "!@#$%^",
    resave: true,
    saveUninitialized: true
}))
app.use(function(req, res, next) {
    res.locals.currentuser = req.session.user;
    next();
});
app.use(express.static(__dirname + "/public"));
/* *************************************************** */
/* Landing */
app.get("/", function(req, res) {
    res.render("landing");
});
/* *************************************************** */
/* login 
1. Admin Login => if username and pass is from admin then open route for /addstudents, /addcourses 
2. Student Login => if from student then open route for /courses, /courses/:id get, /courses/:id post
*/

app.get("/login", function(req, res) {
    if (req.session.user == "admin") {
        res.redirect("/adminhome");
    }
    else {
        res.render("login");
    }


})

app.post("/login", function(req, res) {


    client
        .execute("SELECT * FROM kmd_rating.admins WHERE admin_username='" + req.body.username + "'",
            function(err, result) {
                if (!err) {

                    if (req.body.username == result.rows[0].admin_username) {
                        req.session.user = "admin";
                        console.log(req.session.user)
                        res.redirect("/adminhome")
                    }
                }
                else {
                    console.log(err);
                }
            })
})

/* *************************************************** */
/* admin home page */
app.get("/adminhome", function(req, res) {
    if (req.session.user) {
        res.render("adminhome")
    }
    else {
        res.redirect("/login")
    }
})
/* *************************************************** */
/* student crud page */
 var tried=false;
app.get("/studentcrud", function(req, res) {
    if (req.session.user) {

        client
            .execute("SELECT * FROM kmd_rating.students",
                function(err, result) {
                    if (!err) {
                       
                        res.render("studentcrud", { result: result, tried:tried})
                    }
                    else {
                        console.log(err);
                    }
                })
    }
    else {
        res.redirect("/login")
    }
})

app.post("/studentcrud", function(req, res) {
    if (typeof(req.body.add_admin) != 'undefined') {

        var studentid = req.body.admin_username;
        var studentpass = req.body.admin_pass;

        client
            .execute("INSERT INTO kmd_rating.students (student_id,student_password) VALUES ('"+studentid+"','"+studentpass+"')",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/studentcrud")
                    }

                    else {
                        tried=true;
                             res.redirect("/studentcrud")
                        
                    }
                })
    }

    if (typeof(req.body.update_admin) != 'undefined') {
         var studentid = req.body.admin_username;
        var studentpass = req.body.admin_new_pass;
  
        client
            .execute("UPDATE kmd_rating.students SET student_password='"+studentpass+"' WHERE student_id='"+studentid+"'",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/studentcrud")
                    }

                    else {
                        console.log(err);
                        tried=true;
                             res.redirect("/studentcrud")
                        
                    }
                })
    }
    if (typeof(req.body.delete_admin) != 'undefined') {
        var studentid=req.body.admin_username;
        client
            .execute("DELETE FROM kmd_rating.students WHERE student_id='"+studentid+"' IF EXISTS; ",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/studentcrud")
                    }

                    else {
                        tried=true;
                             res.redirect("/studentcrud")
                        
                    }
                })
    }



})
/* *************************************************** */
/* course crud page */
 var tried=false;
app.get("/coursecrud", function(req, res) {
    if (req.session.user) {

        client
            .execute("SELECT * FROM kmd_rating.courses",
                function(err, result) {
                    if (!err) {
                       
                        res.render("coursecrud", { result: result, tried:tried})
                    }
                    else {
                        console.log(err);
                    }
                })
    }
    else {
        res.redirect("/login")
    }
})
app.post("/coursecrud", function(req, res) {
    if (typeof(req.body.add_admin) != 'undefined') {

        var courseid = req.body.admin_username;
        var coursename = req.body.admin_pass;

        client
            .execute("INSERT INTO kmd_rating.courses (course_id,course_name) VALUES ('"+courseid+"','"+coursename+"')",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/coursecrud")
                    }

                    else {
                        console.log(err);
                        tried=true;
                             res.redirect("/coursecrud")
                        
                    }
                })
    }

    if (typeof(req.body.update_admin) != 'undefined') {
        var courseid = req.body.admin_username;
        var coursename = req.body.admin_new_pass;
  
        client
            .execute("UPDATE kmd_rating.courses SET course_name='"+coursename+"' WHERE course_id='"+courseid+"'",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/coursecrud")
                    }

                    else {
                        console.log(err);
                        tried=true;
                             res.redirect("/coursecrud")
                        
                    }
                })
    }
    if (typeof(req.body.delete_admin) != 'undefined') {
        var courseid=req.body.admin_username;
        client
            .execute("DELETE FROM kmd_rating.courses WHERE course_id='"+courseid+"' IF EXISTS; ",
                function(err, result) {
                 
                    if (!err) {
                        tried=false;
                    res.redirect("/coursecrud")
                    }

                    else {
                        console.log(err);
                        tried=true;
                             res.redirect("/coursecrud")
                        
                    }
                })
    }



})
/* *************************************************** */
app.listen(8080, process.env.IP, function() {
    console.log("Server has Started!!!");
});
