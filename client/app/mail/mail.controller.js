var mail = angular.module('mail', []);

Mail = function(from, date, subject, snippet,body){
	this.from = from;
	this.date=date;
	this.subject = subject;
	this.body = body;
	this.snippet=snippet;
}

mail.controller('mailCtrl', function ($rootScope,$scope) {
	$rootScope.$broadcast('event:sidebarleft-update', [
		{name:'Boite de réception',
		link : '/calendar/',
		icone : 'fa fa-inbox' },
		{name:'Message envoyé',
		link : '/calendar/sent',
		icone : 'fa fa-plane' },
		{name:'Corbeille',
		link : '/calendar/trash',
		icone : 'fa fa-trash'}
		]);


/*	$rootScope.$broadcast('event:sidebarleft-update',[{
		name:'Boite de reception',
		link:'/mail',
		icone:'fa fa-camera-retro fa-2x'
	},{
		name:'Message envoyé',
		link:'/mail/send',
		icone:'"fa fa-camera-retro fa-2x'
	},{
		name:'Corbeille',
		link:'/mail',
		icone:'"fa fa-camera-retro fa-2x'
	}]);
*/
$scope.mails=[];
// TODO enchainer les appels asynchrones en synchrone et mettre les données dans le scope.
gapi.client.load('gmail', 'v1').then(function(){
	gapi.client.gmail.users.messages.list({
		userId : 'me',
		q:'in:inbox'
	}).execute(function(resp){
		messages = resp.messages;
		for (i = 0; i < messages.length; i++) {
			idMessage = messages[i].id;
			gapi.client.gmail.users.messages.get({
				userId:'me',
				id:idMessage
			}).execute(function (resp){
				from = getHeader(resp.payload.headers,'From');
				date = moment(getHeader(resp.payload.headers,'Date'));
				subject = getHeader(resp.payload.headers,'Subject');
				$scope.mails.push(new Mail(from,date.format('DD/MM/YYYY'),subject,resp.snippet,getBody(resp.payload)));
				$scope.$apply();
			});
		}
	});

});
});


function getHeader(headers, index) {
	var header = '';
	$.each(headers, function(){
		if(this.name === index){
			header = this.value;
		}
	});
	return header;
}

function getBody(message) {
	var encodedBody = '';
	if(typeof message.parts === 'undefined')
	{
		encodedBody = message.body.data;
	}
	else
	{
		encodedBody = getHTMLPart(message.parts);
	}
	encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
	return decodeURIComponent(escape(window.atob(encodedBody)));
}

function getHTMLPart(arr) {
	for(var x = 0; x <= arr.length; x++)
	{
		if(typeof arr[x].parts === 'undefined')
		{
			if(arr[x].mimeType === 'text/html')
			{
				return arr[x].body.data;
			}
		}
		else
		{
			return getHTMLPart(arr[x].parts);
		}
	}
	return '';
}