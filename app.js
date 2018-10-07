const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'public')));

var request = require("request");

// verifying connection to EOS node by logging a single block to the console
var options = {
  method: 'POST',
  url: 'http://127.0.0.1:8888/v1/chain/get_block',
  body: '{"block_num_or_id":"145"}'
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  // write to mongodb


  console.log(body);
});

var bodyParser = require('body-parser');
var http = require('http');


app.get('/', (req, res) => {
  res.send('Howdy');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
