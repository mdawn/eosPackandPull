const EosApi = require('eosjs-api');
const express = require('express');
//const app = express();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const path = require('path');
//app.use(express.static(path.resolve(__dirname, 'public')));
const eos = EosApi();
const Block = require('./block');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/eostest', {poolSize: 1});

async function fetchBlock(blockNum){
  console.log("whiskey");
  const dbBlock = await Block.getBlockByNum(blockNum);
  console.log("tango");
  if(dbBlock){
    return dbBlock;
  }
  else {
    try{
      const block = await eos.getBlock(blockNum);
      try{
        const addedBlock = await Block.addBlock(block);
        // console.log(await addedBlock);
        return block;
      }
      catch(err){
        //error adding block to cache, just return block
        return block;
      }
    }
    catch(err){
      console.log("EOS API returned an error; check block number")
      return {error: String(err)};
    }
  }
}


//function for fetching block data from db or EOS node
async function getBlockData(blockNum){
  console.log("getBlockData");
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

/*define graphQL query schema;
some numbers like block_num and ref_block_prefix are better as String
since they are too large to be represented as a 32-bit Int type by GraphQL */
const schemaFile = fs.readFileSync(__dirname + '/schema.graphqls', 'utf8')
const schema = buildSchema(schemaFile)


//for resolving queries to api
let resolveBlocks = async function(args) {
  console.log("resolveBlocks");
  console.log(args);
  if (args.numbers) {
    const numbers = args.numbers;
    const blocks = [];
    for (const blockNum of numbers){
      // console.log(blockNum);
      blocks.push(await getBlockData(blockNum));
    }
    return await blocks;
  }
  else {
    return [await getBlockData()];
  }
}

let resolveLastBlock = async function(args) {
  return await getBlockData();
}

//define root query
let rootQuery = {
  blocks: resolveBlocks,
  lastBlock: resolveLastBlock
};

//graphQL endpoint
var graphQLapp = express();
graphQLapp.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootQuery,
  graphiql: true,
}));

graphQLapp.use(express.static(path.resolve(__dirname, 'public')));

graphQLapp.listen(4000);
console.log('GraphQL server at localhost:4000/graphql');
