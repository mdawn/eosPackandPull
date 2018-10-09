const EosApi = require('eosjs-api');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'public')));
const eos = EosApi();

var blockId = 12;

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// log block in the db
MongoClient.connect("mongodb://localhost:27017/eostest", function(err, db) {
  if (err) throw err;
  var dbo = db.db("eostest");
  eos.getBlock({block_num_or_id: blockId})
    .then(result => {
      dbo.collection("eosBlocks").insertOne(result, function(err, res) {
        if (err) throw err;
        console.log("1 block inserted");
        db.close();
      });
    });
});

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

var bodyParser = require('body-parser');
var http = require('http');

app.get('/show', (req, res) => {
  eos.getInfo({})
    .then(result => res.send(result));
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
