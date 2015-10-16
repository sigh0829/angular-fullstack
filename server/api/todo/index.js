'use strict';

var express = require('express');
var controller = require('./todo.controller');

var router = express.Router();

router.get('/', controller.get);
router.get('/:id', controller.getbyid);
router.post('/', controller.post);


module.exports = router;