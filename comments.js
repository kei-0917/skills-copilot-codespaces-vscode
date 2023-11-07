// Create web server

// Import express module
const express = require('express');

// Import body-parser module
const bodyParser = require('body-parser');

// Import mongoose module
const mongoose = require('mongoose');

// Import Comments model
const Comments = require('../models/comments');

// Create router
const commentRouter = express.Router();

// Use body-parser module
commentRouter.use(bodyParser.json());

// Import verify module
const verify = require('../verify');

// Import cors module
const cors = require('./cors');

// Create route for '/'
commentRouter.route('/')
// Pre-flight requests
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// GET method
.get(cors.cors, (req, res, next) => {
    // Find all comments
    Comments.find(req.query)
    // Populate author of comment
    .populate('author')
    .then((comments) => {
        // Send comments to client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// POST method
.post(cors.corsWithOptions, verify.verifyOrdinaryUser, (req, res, next) => {
    // If user is not admin
    if (!req.decoded.admin) {
        // Create error
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
    // Create new comment
    Comments.create(req.body)
    .then((comment) => {
        // Send comment to client
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// PUT method
.put(cors.corsWithOptions, verify.verifyOrdinaryUser, (req, res, next) => {
    // If user is not admin
    if (!req.decoded.admin) {
        // Create error
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
    // Send error to client
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
// DELETE method
.delete(cors.corsWithOptions, verify.verifyOrdinaryUser