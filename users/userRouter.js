const express = require('express');

const db = require('./userDb.js');
const router = express.Router();

// add user
router.post('/', validateUser, (req, res) => {
   !!req.body && db.insert(req.body)
    .then(user => {
        res.status(201).json(user);
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    db.insert(req.body)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Error adding post' })
    })
   
});

router.get('/', (req, res) => {
    db.get(req.query)
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Error retrieving users.' })
    })
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    db.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Error retrieving user.' })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.user.id
    db.getUserPosts(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: 'Error retrieving posts.' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    db.remove(id)
    .then(count => {
        if(count) {
            res.status(200).json({ message: "Deleted user" })
        } else {
            res.status(404).json({ message: 'This user with the specified ID does not exist.' })
        }
    })
});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db.update(id, changes)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'Error updating user' })
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id
    
    db.getById(id)
    .then(user => {
        if (!user) {
            res.status(400).json({ message: 'Invalid user id.' })
        } else {
            req.user = user
            next();
        }
    })
};

function validateUser(req, res, next) {
    const body = req.body
    if(!!body === false){
        res.status(400).json({ message: 'Missing user data.' })
    } else if (!!body.name === false) {
        res.status(400).json({ message: 'Missing required name field.' })
    } 
        next();
    
};

function validatePost(req, res, next) {
    const body = req.body
    if(!body) {
        res.status(400).json({ message: 'Missing post data.' })
    } else if (!body.text) {
        res.status(400).json({ message: 'Missing required test field.' })
    }
};

module.exports = router;
