
'use strict';

var _ = require('lodash');

var Todo  = function(id,label){
  this.id = id;
  this.label = label;
}

Todo.prototype.label = function(){
  return this.label;
}

var todos = [new Todo(0,"Apprendre JavaScript"),
new Todo(1,"Apprendre Python"),
new Todo(2,"Apprendre C"),
new Todo(3,"Apprendre C++")
];

var exos = [];

/**
* HTTP status :
* 200 : Operation successful.
* 201 : Created
* 400 : Bad request.
* 401 : Not authorized , need to authenticate
* 403 : Forbidden
* 404 : Resource not found.
*/

exports.get = function(req, res) {
  res.json(todos);
};

exports.getbyid = function(req, res){
  var id = req.params.id;
  if(isNaN(id)){
    return res.status(400).json({error : "Invalid id : " +  id});
  } 
  var todo = _.findWhere(todos,{'id': parseInt(id)});
  _.isUndefined(todo)?(
    res.status(404).json({})
    ):(
    res.json(todo)
    );
  };

  exports.post = function(req, res){
   var todo = req.body;
   if(_.isEmpty(todo) || _.isUndefined(todo.label) || _.isEqual(todo.label,'')){
    return res.status(400).json({error : 'No Todo data in request'});
  }
  if(_.isUndefined(_.findWhere(todos,{'label': todo.label})))
  {
    todo = new Todo(getNextId(),todo.label);
    todos.push(todo);
    res.status(201).json(todo);
  } else {
    res.status(400).json({error : 'Todo already exist'});
  };

};

/**
 * Get the next id
 * max +1
 */
 var getNextId = function (){
  if(_.isEmpty(todos)) {return 0};
  return _.max(todos, function(todo){
    return todo.id;
  }).id+1;
};
