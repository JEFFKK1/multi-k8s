import redis from 'redis'

import { redisHost, redisPort} from './keys.js';

const client = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

const sub = client.duplicate()
console.log('sub is connecting' )
sub.on('error', err => {
   console.log('reids error',err)
 });
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');

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