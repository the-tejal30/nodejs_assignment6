const router = require('express').Router();
const Blog = require('../models/Blog')

// Your routing code goes here


router.get('/blog',(req,res) => {
    const { page = '', search = '' } = req.query;
    let perPage = 5;
    let skip = perPage * (parseInt(page) - 1);
    let filter = {};

    if(search) {
        filter = {
            topic: {'$regex': `${search}`, '$options': 'i'}
        }
    }

    Blog.find(filter)
    .skip(skip)
    .limit(perPage)
    .then((blogs) => {
        res.status(200).json({
            status: 'success',
            result: blogs
        });
    })
    .catch((err) => {
        res.status(500).json({
            status: 'failed',
            message: err.message
        });
    })
})


router.post('/blog',(req, res) => {
    const blog = new Blog({
        topic: req.body.topic,
        description: req.body.description,
        posted_at: req.body.posted_at,
        posted_by: req.body.posted_by
    })

    blog.save()
    .then((blog) => {
        res.status(201).json({
            status: 'success',
            result: blog
        });
    })
    .catch((err) => {
        res.status(500).json({
            status: 'failed',
            message: err.message
        })
    });
})


router.put('/blog/:id',(req, res) => {
    // console.log(req.params.id);

    const blogID = req.params.id;
    const updatedContent = req.body;

    // console.log(updatedContent);

    if(blogID) {
        Blog.findOneAndUpdate({
            _id: blogID
        }, updatedContent)
    .then((updatedContent) => {
        res.status(200).json({
            status: 'success',
            result: updatedContent,
        });
    })
    .catch((err) => {
        res.status(500).json({
            status: 'failed',
            message: err.message
        });
    });

    }
})


router.delete('/blog/:id', (req, res) => {
    const blogID = req.params.id;
    console.log(blogID);

    Blog.deleteOne({_id:blogID})
    .then((deletedContent) => {
        res.status(200).json({
            status: 'success',
            result: deletedContent,
        });
    })
    .catch((err) => {
        res.status(500).json({
            status: 'failed',
            message: err.message
        });
    });
})


module.exports = router;