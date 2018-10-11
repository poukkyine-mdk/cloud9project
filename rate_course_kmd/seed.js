/* Connection to Cassandra */
"use strict";
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['172.18.0.2']
});
client.connect()
.then(()=>client.execute("CREATE KEYSPACE kmd_rating WITH REPLICATION = {  'class' : 'NetworkTopologyStrategy',  'datacenter1' : 2 }"))
.then(()=>client.execute("USE kmd_rating"))
.then(()=>client.execute("CREATE TABLE students (student_id text, student_password text, PRIMARY KEY (student_id))"))
.then(()=>client.execute("CREATE TABLE courses (course_id text, course_name text, PRIMARY KEY (course_id))"))
.then(()=>client.execute("CREATE TABLE ratings (course_code text,course_name text,course_lecturer text,Student_id text,Student_email text, Academic_year text, Semester text, Feedback text, Rating int, PRIMARY KEY ((course_code, semester, academic_year),student_id))"))
.then(()=>client.execute("CREATE TABLE admins (admin_username text, admin_password text, PRIMARY KEY (admin_username))"))
.then(()=>client.execute("INSERT INTO admins(admin_username,admin_password) VALUES('admin','admin')"))
.then(()=> client.shutdown())

  .catch(function(err) {
    console.error('There was an error when connecting', err);
    return client.shutdown();
  });