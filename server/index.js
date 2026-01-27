import { envVars }  from "./keys.js";
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Pool } from 'pg'
import redis from 'redis'

// express app setup
const app = express()
app.use(cors())
app.use(bodyParser.json())

//popstgress client setup

const pgClient = new Pool({
    user: envVars.pgUser,
    host: envVars.pgHost,
    database: envVars.pgDatabase,
    password: envVars.pgPassword,
    port: envVars.pgPort
}) 
pgClient.on('error', () => {
    console.log('Lost PG Connection')
})
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

//redis client setup
//const redis = 
const redisClient = redis.createClient({
  socket: {
    host: envVars.redisHost,
    port: envVars.redisPort,
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
});


// const redisClient = redis.createClient({
//     host: envVars.redisHost,
//     port: envVars.redisPort,
//     retry_strategy: () => 1000
// })

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

console.log('ping: ',await redisClient.ping()); // Should print PONG

const redisPublisher = redisClient.duplicate()

// console.log('ping the redis publisher: ',await redisPublisher.ping()); // Should print PONG


console.log('redis client = ', redisClient)
console.log('redis client = ', redisClient)
console.log('redisHost = ', envVars.redisHost)
console.log('redisPort = ', envVars.redisPort)
// Express route Handlers

app.get('/', (req, res) =>{
    res.send('hi, listening successful')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values')
    console.log('pgclient value.rows: ', values.rows)
    res.send(values.rows)
})

app.get('/values/current', async (req,res) => {
    if(!redisClient) {
        console.log('there is no redis client connected  for values/current')
        throw('no re4disClient')
    }
    else {
        console.log('there appears to be a redis client')
    }
    await redisClient.HGETALL('values', (err, values)=>{ 
        console.log('hgetall values: ', values)
        res.send(values)
    })
})

app.post('/values', async (req, res) => {
    console.log('posting:', req.body.index)
    const index = req.body.index
    if(parseInt(index) > 40 ) {
        return res.status(422).send('Value of index is too high')
    }//await client.HSET("key", "field", "value");
    await redisClient.HSET("index","values", "value")
    await redisPublisher.publish('insert', index)
    console.log('redis processing complete')
    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
    console.log('pg processing complete')
    res.send({working: true})
})

app.listen(5000,err => {
    console.log('Im listening on port 5000!!!')
})