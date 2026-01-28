import redis from 'redis'

import { redisHost, redisPort} from './keys.js';
// const client = redis.createClient(
//     redisHost,
//     redisPort,
//   //  retry_strategy= () => 10
// )
const client = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});


//const client = redis.createClient({ url: 'redis://localhost:6379' });

const sub = client.duplicate()
console.log('sub is connecting' )
sub.on('error', err => {
   console.log('reids error',err)
 });
//
//sub.connect();
//console.log('redisSub for worker = :', redisClient )
 

async function doSubscribe() {
        console.log('going to connect now')
        console.log('are we turning on message')
        sub.on('error', err => {
            console.log('reids error',err)
        });
        sub.on('message', (channel, message) => {
            console.log(`Received the following message from ${channel}: ${message}`);
                // redisClient.hset('values', message, fib(parseInt(message)))
        })
             //await redisClient.subscribe('insert')
        console.log('are we turning on subscribe')
        sub.subscribe('insert', (message) => {
            console.log('the message = ', message)
             console.log('fib solution: ',fib(parseInt(message)))
          //  finish(message)
        })   
    }
async function doPublish() {
    const pub = redis.createClient({
        host: redisHost,
        port: redisPort,
        retry_strategy: () => 1000,
    });;
   // await pub.connect();
    // await sleep(5000)
    console.log('we are going to publish now')
    await pub.publish('insert', '8');
}
const finish = async (theMessage) => {
    console.log('fib solution: ',fib(parseInt(theMessage)))
//     const intFib = fib(parseInt(theMessage))
//   //  client.connect()
//      await client.hSet('values', theMessage, intFib,(err, reply) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('Fib  updated:', reply);}
//     })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fib(num) {
    let num1 = 0;
    let num2 = 1;
    let sum;
    if (num === 1) {
        return num1;
    } else if (num === 2) {
        return num2;
    } else {
        for (let i = 3; i <= num; i++) {
            sum = num1 + num2;
            num1 = num2;
            num2 = sum;
        }
        return num2;
    }
}
doSubscribe()

//doPublish()
