angular.module('flawwengApp').directive('googleSignin', ['$window', '$rootScope', function ($window, $rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    template: '<span></span>',
    replace: true,
    link: function (scope, element, attrs, ctrl, linker) {
    //  console.log("Connecté? : " + gapi.auth2.GoogleUser.isSignedIn());
    attrs.clientid = '190564632536-g0ksc1at7sh9aal7u4cgsfd2632uotic.apps.googleusercontent.com';
    attrs.$set('data-clientid', attrs.clientid);
    var defaults = {
      onsuccess: onSignIn,
      cookiepolicy: 'single_host_origin',
      scope: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar',
      longtitle: true,
      theme: 'dark',
      autorender: true,
     width:300,
     height:50
   };
   angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
    if (attrs.hasOwnProperty(propName)) {
      defaults[propName] = attrs[propName];
    }
  });

   defaults.clientid = attrs.clientid;
   function onSignIn(authResult) {
    var currentUser = {
      'name' : authResult.getBasicProfile().getName(),
      'email' : authResult.getBasicProfile().getEmail()
    };
    $rootScope.currentUser = currentUser;
    $window.sessionStorage.currentUser=JSON.stringify(currentUser);
    $rootScope.$broadcast('event:google-signin-success', authResult, currentUser);
    

} 
function onSignInFailure() {
  console.log("Sign in failure");
  $rootScope.$broadcast('event:google-plus-signin-failure', null);
};

linker(function (el, tScope) {
  if (el.length) {
    element.append(el);
  }
  gapi.load('auth2', function () {
    var googleAuthObj =
    gapi.auth2.init({
      client_id: defaults.clientid,
      cookie_policy: defaults.cookiepolicy
    });
  });
  gapi.signin2.render(element[0], defaults);

});

}
}
}]);
//.run();