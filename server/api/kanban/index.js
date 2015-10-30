'use strict';

var express = require('express');
var controller = require('./kanban.controller');

var router = express.Router();
router.get('/', controller.get);
router.get('/:id', controller.getById);


router.post('/:idKanban/column/:idColumn/task', controller.createTask);

router.delete('/:idKanban/column/:idColumn/task/:idTask', controller.deleteTask);

module.exports = router;