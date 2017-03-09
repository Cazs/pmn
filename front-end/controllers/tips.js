pmn.controller('TipsController', ['$scope','$http','$location','$routeParams',function TipsController($scope, $http, $location, $routeParams)
{
  console.log('Init TipsController... ');

  console.log('Sending request for tips..');
  $http(
  {
      method: 'GET',
      url: '/api/tips',
      //data: 'username=' + username + '&password=' + password + '&email=' + email,
      headers:
      {
          /*"Cookie": "GL4Hk3HETMxsxZN3"*/
      }
  }).then(function(response)
  {
    if(response)
    {
      $scope.tips = response.data;
      console.log('Got valid response from server, set services object.');
    }else{
      console.log('Null response from server.');
    }
  });
}]);
