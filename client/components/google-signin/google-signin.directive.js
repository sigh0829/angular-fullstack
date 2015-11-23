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
      onfailure: onSignInFailure,
      scope: 'https://mail.google.com/',
      longtitle: true,
      theme: 'dark',
     // autorender: true,
     width:200
   };
   angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
    if (attrs.hasOwnProperty(propName)) {
      defaults[propName] = attrs[propName];
    }
  });

   defaults.clientid = attrs.clientid;
   function onSignIn(authResult) {
    $rootScope.currentUserSignedIn = true;
    $rootScope.$broadcast('event:google-plus-signin-success', authResult);

  } 
  function onSignInFailure() {
    console.log("Sign in failure");
    $rootScope.$broadcast('event:google-plus-signin-failure', null);
  };

  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.src = 'https://apis.google.com/js/client:platform.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
  linker(function (el, tScope) {
    po.onload = function () {
      if (el.length) {
        element.append(el);
      }
      gapi.load('auth2', function () {
        var googleAuthObj =
        gapi.auth2.init({
          client_id: defaults.clientid,
          cookie_policy: defaults.cookiepolicy
        });
        gapi.signin2.render(element[0], defaults);
      });
    };
  });

}
}
}])
.run();