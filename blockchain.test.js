const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./crypto-hash');

describe('Blockchain', () => {
    let blockchain;
    let newChain;
    let originalChain;

    // Resets the blockchain variable to a new blockchain before each test
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo-bar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    //Chain validation
    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({ data: 'one'});
                blockchain.addBlock({ data: 'two'});
                blockchain.addBlock({ data: 'three'});
            });

            // test for invalid hash
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'overwrite old hash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            // test for invalid data
            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'changed data';
                    
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.length-1];
                    const lastHash = lastBlock.hash;
                    const timeStamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timeStamp, lastHash, difficulty, nonce, data);
                    const badBlock = new Block({ 
                        timeStamp, lastHash, hash, nonce, difficulty, data
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                // same blockchain length
                // change the genesis block, make it invalid
                newChain.chain[0] = { new: 'chain' };
                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'one'});
                newChain.addBlock({ data: 'two'});
                newChain.addBlock({ data: 'three'});
            })
            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    // make an invalid block
                    newChain.chain[2].hash = 'wrong hash';
                    blockchain.replaceChain(newChain.chain);
                });

                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});
