const MINE_RATE = 1000; // 1000 ms = 1s
const INITIAL_DIFFICULTY = 1;

const GENESIS_DATA = {
    timeStamp: 1,
    lastHash: '---',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE };