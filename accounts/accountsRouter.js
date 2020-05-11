const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    //get a list of posts from the database
    // normally would be something like: select * from posts
    //this will return a promise
    db.select('*').from('accounts')
        .then(accounts => {
            res.status(200).json({ data: accounts })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: error.message })
        })
    //respond with the posts and 200
});

// router.get('/:id', (req, res) => {
    //mine
    // db.select('*').from('posts').where('id', req.params.id)
    // .then(post=>{
    //     res.status(200).json({data: post})
    // })
    // .catch(err=>{
    //     console.log(err)
    //     res.status(500).json({message:err.message})
    // })
    //luis's
//     db('accounts').where({ id: req.params.id })
//         .first() //we know we should only get one record. the command only gets the first thing from array and returns it. so in our example it takes it from an array and just makes it an object
//         .then(accounts=>{
//             if(accounts){
//                 res.status(200).json({ data: accounts })
//             }else{
//                 res.status(404).json({ message: 'account not found'})
//             }
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({ message: err.message })
//         })
// });

router.post('/', (req, res) => {
    //a post must have a title and contents
    //once ou know the post is valid then try to save to the db
    const accounts = req.body;
    if(isValidAccount(accounts)){
        db("accounts")
        .insert(accounts, "id")//there will be a waring in the console about that returning. ignore it when using sqlite
        .then(ids=>{
            res.status(201).json({data:ids})
        })
        .catch(error=>{
            res.status(500).json({message: error.message})
        })
    }else{
        res.status(400).json({message:'validation failed'})
    }//always validate your stuff
});

router.put('/:id', (req, res) => {
    const changes = req.body
    db("accounts")
    .where({id:req.params.id})
    .update(changes)
    .then(count=>{
        if(count){
            res.status(201).json({data:count})
        }else{
            res.status(404).json({message:'account not found by that id'})
        }
    })
    .catch(error=>{
        res.status(500).json({message: error.message})
    })
});

router.delete('/:id', (req, res) => {
    db("accounts")
    .where({id:req.params.id})
    .del()
    .then(count=>{
        if(count){
            res.status(201).json({data:count})
        }else{
            res.status(404).json({message:'record not found by that id'})
        }
    })
    .catch(error=>{
        res.status(500).json({message: error.message})
    })
});

//validation can just be a function, and dosent need to have middleware
function isValidAccount(accounts){
    return Boolean(accounts.name && accounts.budget)
}

module.exports = router;