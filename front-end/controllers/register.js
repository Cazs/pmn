pmn.controller('RegisterController',['$scope','$http','$location','$routeParams',function($scope, $http, $location, routeParams)
{
  $scope.username = null;
  $scope.password = null;
  $scope.email = null;

  $scope.register = function()
  {
    if($scope.username && $scope.password && $scope.email)
    {
      console.log('valid user data. onwards!');
      var data = encodeURIComponent('usr') + '=' + encodeURIComponent($scope.username) + '&'
                  + encodeURIComponent('pwd') + '=' + encodeURIComponent($scope.password) + '&'
                  + encodeURIComponent('email') + '=' + encodeURIComponent($scope.email);
      try
      {
        $http(
          {
            method: "POST",
            url: "/api/user/add",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj)
            {
              return obj;
            },
            data: $.param({'usr':$scope.username, 'pwd':$scope.password, 'email':$scope.email})
          }).then(function(response)
          {
            if(response.status==200)
            {
              alert('Successfully registered your account');
              console.log('Successfully registered your account');
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
