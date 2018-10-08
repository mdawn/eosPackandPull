const EosApi = require('eosjs-api');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'public')));
const eos = EosApi();


// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/eostest", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

var request = require("request");
var blockId = 12;



// verifying connection to EOS node by logging a single block to the console
var options = {
  method: 'POST',
  url: 'http://127.0.0.1:8888/v1/chain/get_block',
  body: '{"block_num_or_id":"6945"}'
};

eos.getBlock({block_num_or_id: blockId})
  .then(result => console.log(result));

eos.getInfo({})
  .then(result => console.log(result));

  // write to mongodb


var bodyParser = require('body-parser');
var http = require('http');


app.get('/', (req, res) => {
  res.send('Howdy');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
