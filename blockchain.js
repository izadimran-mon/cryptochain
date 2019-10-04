const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({ data }){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };

        for (let i = 1 ; i < chain.length ; i ++) {
            const block = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;
            const { timeStamp, lastHash, hash, nonce, difficulty, data } = block;

            const realHash = cryptoHash(timeStamp, lastHash, data, nonce, difficulty);

            // check if the `lastHash` value 
            if (lastHash !== actualLastHash) return false;

            // // check if the `hash` value of all blocks are correct
            if (hash !== realHash) return false;

            if ((lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be LONGER');
            return;
        }

        if (!Blockchain.isValidChain(chain)){
            console.error('The incoming chain must be VALID');
            return;
        }
        console.log('replacing the chain with', chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;