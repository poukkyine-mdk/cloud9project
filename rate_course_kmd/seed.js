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