const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-97f8194e-af96-4e16-ad44-faac396ce7e1',
    subscribeKey: 'sub-c-f2e48632-b1f5-11e9-a732-8a2b99383297',
    secretKey: 'sec-c-OGFmYWRhNTYtYmJhYi00NGU1LTllZmItMzkzYjVlY2FiYzA4'
};

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        // this.pubnub.addListener(this.listener);
        this.pubnub.addListener({
            message: messageObject  =>  {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        });

    }

    listener() {
        console.log("entered listener")
        return {
            message: messageObject  =>  {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message }).then(result => {
            console.log("successful");
        })
        .catch(error => {
            console.log(error);
        });
    }
}

const testPubSub =  new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

// so that other files can access this class
module.exports = PubSub;


