const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema object
let action = {
    account: String,
    name: String,
    authorization: [{
        actor: String,
        permission: String
    }],
    data: {
        to: String,
        from: String,
        quantity: String,
        memo: String
    },
    hex_data: String
}

let BlockSchema = new Schema({
    id: String,
    block_num: String,
    timestamp: String,
    txn_count: Number,
    previous: String,
    transaction_mroot: String,
    action_mroot: String,
    block_mroot: String,
    producer: String,
    ref_block_prefix: String,
    new_producers: [String],
    producer_signature: String,
    error: String,
    regions: [{
        region: Number,
        cycles_summary: [[{
            read_locks: [{
                account: String,
                scope: String
            }],
            write_locks: [{
                account: String,
                scope: String
            }],
            transactions: [{
                status: String,
                id: String
            }]
        }]]
    }],
    input_transactions: [{
        signatures: [String],
        compression: String,
        hex_data: String,
        data: {
            expiration: String,
            region: Number,
            ref_block_num: String,
            ref_block_prefix: String,
            packed_bandwidth_words: Number,
            context_free_cpu_bandwidth: Number,
            context_free_actions: [action],
            actions: [action]
        }
    }]

}, { runSettersOnQuery: true });

const Block = module.exports = mongoose.model('Block', BlockSchema);

// gets block number, pulls from db & returns it
module.exports.getBlockByNum = async function (block_num) {
    const query = { block_num: block_num };
    let result = await Block.findOne(query, () => {} );
    return result;
}

// defines info to go in db
module.exports.addBlock = async function (newBlock) {
    if(!newBlock.error){
        const blockForDB = new Block({
            id: newBlock.id,
            block_num: newBlock.block_num,
            timestamp: newBlock.timestamp,
            txn_count: newBlock.txn_count,
            previous: newBlock.previous,
            transaction_mroot: newBlock.transaction_mroot,
            action_mroot: newBlock.action_mroot,
            block_mroot: newBlock.block_mroot,
            producer: newBlock.producer,
            ref_block_prefix: newBlock.ref_block_prefix,
            new_producers: newBlock.new_producers,
            producer_signature: newBlock.producer_signature,
            error: newBlock.error,
            regions: newBlock.regions,
            input_transactions: newBlock.input_transactions
        });

        blockForDB.save( () => {} );
    }
}
