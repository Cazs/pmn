pmn.controller('PaintsController', ['$scope','$http','$location','$routeParams',function PaintsController($scope, $http, $location, $routeParams)
{
  console.log('Init PaintsController... ');

  console.log('Sending request for paints..');
  $http(
  {
      method: 'GET',
      url: '/api/paints',
      //data: 'username=' + username + '&password=' + password + '&email=' + email,
      headers:
      {
          /*"Cookie": "GL4Hk3HETMxsxZN3"*/
      }
  }).then(function(response)
  {
    if(response)
    {
      $scope.paints = response.data;
      console.log('Got valid response from server, set paints object.');
    }else{
      console.log('Null response from server.');
    }
  });
}]);
