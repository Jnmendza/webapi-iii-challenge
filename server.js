const express = require('express');
const helmet = require('helmet')
const server = express();

const userRouter = require('./users/userRouter')
const postRouter = require('./posts/postRouter')


// custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)

 next();
}

//global middleware
server.use(helmet())
server.use(logger);
server.use(express.json())

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});


module.exports = server;
