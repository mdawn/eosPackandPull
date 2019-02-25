const EosApi = require('eosjs-api');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
const eos = EosApi({httpEndpoint: 'http://eosio:8888'});
const Block = require('./block');
const mongoose = require('mongoose');

let uri = 'mongodb://heroku_knk43932:6me9jt605lr36njsnk5giakkmn@ds351455.mlab.com:51455/heroku_knk43932';

mongoose.connect(uri, {poolSize: 1});

// calls the db or eos
async function fetchBlock(blockNum){
  const dbBlock = await Block.getBlockByNum(blockNum);
  if(dbBlock){
    return dbBlock;
  }
  else {
    try{
      const block = await eos.getBlock(blockNum);
      try{
        const addedBlock = await Block.addBlock(block);
        return block;
      }
      // return the block even if can't log to db
      catch(err){
        return block;
      }
    }
    // if there's an error getting the block from eos, return an error
    catch(err){
      return {error: String(err)};
    }
  }
}

// wrapper that gets either recent block or block by number
async function getBlockData(blockNum){
  blockNum = blockNum || -1;
  if (blockNum === -1){
    const data = await eos.getInfo({});
    const lastBlockNum = data['head_block_num'];
    return await fetchBlock(lastBlockNum);
  }
  else {
    return await fetchBlock(blockNum);
  }
}

// defines graphQL query schema
const schemaFile = fs.readFileSync(__dirname + '/schema.graphqls', 'utf8')
const schema = buildSchema(schemaFile)

// returns an array of block data
let resolveBlocks = async function(args) {
  if (args.numbers) {
    const numbers = args.numbers;
    const blocks = [];
    for (const blockNum of numbers){
      blocks.push(await getBlockData(blockNum));
    }
    return await blocks;
  }
  // fallback to return latest block
  else {
    return [await getBlockData()];
  }
}

let resolveLastBlock = async function(args) {
  return await getBlockData();
}

// define root query
let rootQuery = {
  blocks: resolveBlocks,
  lastBlock: resolveLastBlock
};

// graphQL endpoint
var graphQLapp = express();
graphQLapp.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootQuery,
  graphiql: true,
}));

graphQLapp.use(express.static(path.resolve(__dirname, 'public')));
graphQLapp.listen(4000);
