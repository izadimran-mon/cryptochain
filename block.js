const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({ timeStamp, lastHash, hash, data, nonce, difficulty }) {
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    //factory method - function that creates instances of a class,
    // WITHOUT USING CONSTRUCTOR METHOD
    static genesis() {
        return new Block(GENESIS_DATA);
    }

    static mineBlock({ lastBlock, data }) {
        let hash, timeStamp;
        // const timeStamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {
            nonce ++;
            timeStamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timeStamp});
            hash = cryptoHash(timeStamp, lastHash, data, nonce, difficulty);
        } while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new Block({
            timeStamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
            // hash: cryptoHash(timeStamp, lastHash, data, nonce, difficulty)
        });
    }

    static adjustDifficulty({ originalBlock, timeStamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) {
            return 1;
        }
        if ((timeStamp - originalBlock.timeStamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

// share this class with other files
module.exports = Block;



// const block1 = new Block({
//     timeStamp: '01/01/01', 
//     lastHash: 'foo-lastHash',
//     hash: 'foo-hash', 
//     data: 'foo-data'
// });
// console.log('block1', block1);