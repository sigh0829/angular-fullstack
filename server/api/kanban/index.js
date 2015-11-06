'use strict';

var express = require('express');
var controller = require('./kanban.controller');

var router = express.Router();
router.get('/', controller.get);
router.get('/:id', controller.getById);

var taskPath = '/:idKanban/column/:idColumn/task';

router.post(taskPath, controller.createTask);
router.delete(taskPath + '/:idTask', controller.deleteTask);
router.put(taskPath+ '/:idTask', controller.updateTask);
module.exports = router;