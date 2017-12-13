'use strict';


const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    { BlogPosts } = require('./models'),
    requiredFields = ['title', 'content', 'author'];



BlogPosts.create('beans', 'blog post test 1', 'alex');
BlogPosts.create('tomatoes', 'blog post test 2', 'alex');
BlogPosts.create('peppers', 'blog post test 3', 'alex');


router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});



router.post('/', jsonParser, (req, res) => {

    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    });

    const item = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author,
        req.body.publishDate
    );

    res.status(201).json(item);
});



router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});



router.put('/:id', jsonParser, (req, res) => {

    requiredFields.forEach((field) => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    });

    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }

    console.log(`Updating blog post \`${req.params.id}\``);

    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });

    res.status(204).end();
});

module.exports = router;