pmn.controller('LoginController',['$scope','$http','$location','$routeParams',function($scope, $http, $location, routeParams)
{
  $scope.username = null;
  $scope.password = null;

  var createCookie = function(name, value, expires)
  {
    var s_expires;
    if (expires)
    {
        var date = new Date();
        date.setTime(expires*1000);
        s_expires = "; expires=" + date.toGMTString();
    }
    else
    {
        s_expires = "";
    }
    document.cookie = name + "=" + value + s_expires + "; path=/";
    console.log('created cookie');
}

  $scope.login = function()
  {
    if($scope.username && $scope.password)
    {
      try
      {
        $http(
          {
            method: "POST",
            url: "/api/auth",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj)
            {
              return obj;
            },
            data: $.param({'usr':$scope.username, 'pwd':$scope.password})
          }).then(function(response)
          {
            if(response.status==200)
            {
              alert('Successfully logged in');
              var session = response.headers('Session');

              var session_attrs = session.split(';');
              /*window.session = function()
              {
                this.username=$scope.username;
              }*/
              $scope.username;

              session_attrs.forEach(function(attr)
              {
                if(attr)
                {
                  switch (attr.split('=')[0])
                  {
                    case 'session':
                      //$scope.session = attr.split('=')[1];
                      $scope.session = attr.split('=')[1];
                      //console.log($scope.session);
                      break;
                    case 'ttl':
                      $scope.session_ttl = attr.split('=')[1];
                      break;
                    case 'date':
                      $scope.session_date_issued = attr.split('=')[1];
                      break;
                    default:
                      console.log('Unknown session attribute "%s"', attr.split('=')[0])
                  }
                }
              });
              var exp_date = Math.floor($scope.session_date_issued)+Math.floor($scope.session_ttl);
              console.log('expires: %s, ttl=%s', exp_date, $scope.session_ttl);
              createCookie('pmn', $scope.session, exp_date);
              createCookie('pmn_usr', $scope.username, exp_date);
              console.log('Successfully logged in');
            }
            console.log('Response: %s', response.statusText);
          });
      } catch (e)
      {
          console.log(e);
      }
    }else{
      console.log('invalid form data');
    }
  }
}]);
