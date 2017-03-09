pmn.controller('ServicesController', ['$scope','$http','$location','$routeParams',function ServicesController($scope, $http, $location, $routeParams)
{
  console.log('Init ServicesController... ');

  console.log('Sending request for services..');
  $http(
  {
      method: 'GET',
      url: '/api/services',
      //data: 'username=' + username + '&password=' + password + '&email=' + email,
      headers:
      {
          /*"Cookie": "GL4Hk3HETMxsxZN3"*/
      }
  }).then(function(response)
  {
    if(response)
    {
      $scope.services = response.data;
      console.log('Got valid response from server, set services object.');
    }else{
      console.log('Null response from server.');
    }
  });
}]);
