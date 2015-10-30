
'use strict';

var fs = require("fs");
var _ = require('lodash');
var uuid = require('node-uuid');
var dataFilePath = 'server/data/data.json';


var getData = function (){
	return JSON.parse(fs.readFileSync(dataFilePath));
}

var saveData = function(jsonObject){
	fs.writeFile(dataFilePath, JSON.stringify(jsonObject, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + dataFilePath);
		}
	});
}


exports.get = function(req, res){
	var data = JSON.parse(fs.readFileSync('server/data/data.json'));
	return res.json(data["kanban"]);
}


exports.getById = function(req, res){
	var id = req.params.id;
	var data =getData();
	var kanban = getKanbanById(data,id);
	if(_.isEmpty(kanban)) return res.json({});
	var columns = getColumns(data,kanban);
	if(_.isEmpty(columns)) return res.json(kanban);
	kanban.columns = _.first(columns).columnsList;
	for(var i in kanban.columns){
		var column = kanban.columns[i];
		column.tasks = getTasks(data,column);
	}
	return res.json(kanban);
}


exports.createTask = function(req,res){
	var idKanban = req.params.idKanban;
	var idColumn = req.params.idColumn;
	var data = getData();
	var column = getColumn(data,getKanbanById(data,idKanban), idColumn);
	if(column == undefined) return res.status(400).json({error : 'Le kanban '+idKanban +' ou la colonne ' + idColumn +' n\'exsite pas.'});
	var task = req.body;
	task.id = uuid.v1();
	task.idColumn = idColumn;
	data['tasks'].push(task);
	saveData(data);
	return res.json(task);

}

exports.deleteTask = function(req,res){
	var idKanban = req.params.idKanban;
	var idColumn = req.params.idColumn;
	var idTask = req.params.idTask;
	var data = getData();
	var task = getTask(data,idKanban, idColumn, idTask);
	if(task==undefined)
		return res.status(400).json({error : "La tache n\'existe pas : " +  idTask});
	data['tasks']= _.without(data['tasks'],task);
	saveData(data);
	return res.json();

}

// Need to check if resources exist (not only the task).
var getTask = function (data, idKanban, idColumn, idTask){
	var kanban = getKanbanById(data, idKanban);
	var column =  getColumn(data,kanban, idColumn);
	var tasks = getTasks(data,column);
	return _.first(_.filter(tasks, {'id' : idTask}));
}

var getKanbanById = function(data,id){
	return _.first(_.filter(data["kanban"], { 'id': id }));
}

var getColumns = function (data, kanban){
	var columns = data["columns"];
	return _.filter(columns, { 'idKanban': kanban.id });
}

var getColumn = function(data, kanban, idColumn){
	var columns = _.first(getColumns(data,kanban));
	var column = _.first(_.filter(columns.columnsList, { 'id': idColumn }));
	return column;
}

var getTasks = function(data, column){
	var tasks = data["tasks"];
	return _.filter(tasks, { 'idColumn': column.id });	
}

