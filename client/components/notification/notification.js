angular.module('ui-notification',[]).factory('notification',['$timeout','$http','$compile','$templateCache','$rootScope', 
 function($timeout,$http,$compile,$templateCache,$rootScope){

    var defaults = {
        startTop : 10,
        verticalSpacing : 15,
        defaultDuration : 15000,
        defaultTemplateUrl : 'angular-notify.html',
        position : 'center',
        container : document.body,
        maximumOpen : 0
    }

    var messageElements = [];
    var openNotificationsScope = [];

    var notify = function(args){
        args.duration = args.duration ? args.duration : defaults.defaultDuration;
        args.templateUrl = args.templateUrl ? args.templateUrl : defaults.defaultTemplateUrl;
        args.container = args.container ? args.container : defaults.container;
        args.classes = args.classes ? args.classes : '';

        var scope = args.scope ? args.scope.$new() : $rootScope.$new();
        scope.$position = args.position ? args.position : defaults.position;
        scope.$message = args.message;
        scope.$classes = args.classes;
        scope.$messageTemplate = args.messageTemplate;

        $http.get(args.templateUrl,{cache: $templateCache}).success(function(template){
            var templateElement = $compile(template)(scope);
            templateElement.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd', function(e){
                if (e.propertyName === 'opacity' || e.currentTarget.style.opacity === 0 || 
                    (e.originalEvent && e.originalEvent.propertyName === 'opacity')){

                    templateElement.remove();
                messageElements.splice(messageElements.indexOf(templateElement),1);
                openNotificationsScope.splice(openNotificationsScope.indexOf(scope),1);
                layoutMessages();
            }
        });


            angular.element(args.container).append(templateElement);
            messageElements.push(templateElement);

            scope.$close = function(){
                templateElement.css('opacity',0).attr('data-closing','true');
                layoutMessages();
            };


            var layoutMessages = function(){
                var j = 0;
                var currentY = defaults.startTop;
                console.log(messageElements);
                for(var i = messageElements.length - 1; i >= 0; i --){
                    var shadowHeight = 10;
                    var element = messageElements[i];
                    var height = element[0].offsetHeight;
                    var top = currentY + height + shadowHeight;
                    if (element.attr('data-closing')){
                        top += 20;
                    } else {
                        currentY += height + defaults.verticalSpacing;
                    }
                    element.css('top',top + 'px').css('margin-top','-' + (height+shadowHeight) + 'px').css('visibility','visible');
                    j ++;
                }
            };

            $timeout(function(){
                layoutMessages();
            });

            if (args.duration > 0){
                $timeout(function(){
                    scope.$close();
                },args.duration);
            }



        }).error(function(data){
            throw new Error('Template specified for ui-notification ('+args.templateUrl+') could not be loaded. ' + data);
        });

    }


    return notify;
}])



angular.module('ui-notification').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('angular-notify.html',
    "<div class=\"cg-notify-message\" ng-class=\"[$classes, \n" +
    "    $position === 'center' ? 'cg-notify-message-center' : '',\n" +
    "    $position === 'left' ? 'cg-notify-message-left' : '',\n" +
    "    $position === 'bottom' ? 'cg-notify-message-bottom' : '',\n" +
    "    $position === 'right' ? 'cg-notify-message-right' : '']\"\n" +
    "    ng-style=\"{'margin-left': $centerMargin}\">\n" +
    "\n" +
    "    <div ng-show=\"!$messageTemplate\">\n" +
    "        {{$message}}\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"$messageTemplate\" class=\"cg-notify-message-template\">\n" +
    "        \n" +
    "    </div>\n" +
    "\n" +
    "    <button type=\"button\" class=\"cg-notify-close\" ng-click=\"$close()\">\n" +
    "        <span aria-hidden=\"true\">&times;</span>\n" +
    "        <span class=\"cg-notify-sr-only\">Close</span>\n" +
    "    </button>\n" +
    "\n" +
    "</div>"
    );

}]);