
'use strict';

var _ = require('lodash');

var Todo  = function(id, title, completed){
  this.id=id;
  this.title = title;
  this.completed = completed;
}

var todos = [new Todo("f0579b50-7e43-11e5-97a2-a72c21e930b1","Apprendre JavaScript", false),
new Todo("f0579b50-7e43-11e5-97a2-a72c21e930b2", "Apprendre Python", false),
new Todo("f0579b50-7e43-11e5-97a2-a72c21e930b3","Apprendre C", false),
new Todo("f0579b50-7e43-11e5-97a2-a72c21e930b4","Apprendre C++", false)
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
   if(_.isEmpty(todo) || _.isUndefined(todo.title) || _.isEqual(todo.title,'')){
    return res.status(400).json({error : 'No Todo data in request'});
  }
  if(_.isUndefined(_.findWhere(todos,{'title': todo.title})))
  {
    todo = new Todo(getNextId(),todo.title);
    todos.push(todo);
    res.status(201).json(todo);
  } else {
    res.status(400).json({error : 'Todo already exist'});
  };

};


exports.update = function(req,res){
  var id = req.params.id;
  var newTodo = req.body;
  var todo = _.first(_.filter(todos, { 'id': id }));
  if(_.isEmpty(todo)) return res.status(400).json({error : 'No Todo with id ' + id});
  var index = _.findIndex(todos, {'id' : id});
  todos[index] = newTodo;
  console.log(todos);
  return res.json(newTodo);
}



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
