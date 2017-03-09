//var pmn = angular.module('pmn', ['ngRoute']);

pmn.controller('BookingsController',['$scope','$http','$location','$routeParams',function($scope, $http, $location, $routeParams)
{
  $scope.names=null;
  $scope.email=null;
  $scope.contact=null;
  $scope.app_date=null;
  $scope.app_time=null;

  loadUserBookings = function()
  {
    if(!$scope.user || !$scope.session)
    {
      alert('Please log in to view bookings.');
      console.log('session user not set, log in!');
      return;
    }

    /*if((new Date().getTime()/1000) < window.session_date_issued + window.session_ttl)
    {
      alert('Session expired, please log in in again.');
      console.log('session expired, log in!');
      return;
    }*/

    $http(
    {
        method: 'GET',
        url: '/api/booking/' + $scope.user,
        //data: 'username=' + username + '&password=' + password + '&email=' + email,
        headers:
        {
            "session": $scope.session
        }
    }).then(function(response)
    {
      if(response)
      {
        $scope.bookings = response.data;
        console.log('got valid response from server, set bookings object.');
      }else{
        console.log('null response from server.');
      }
    });
  };

  function getCookie(cookie_name)
  {
      if (document.cookie.length > 0)
      {
          var cookie_begin_pos = document.cookie.indexOf(cookie_name + "=");
          if (cookie_begin_pos != -1)
          {
              cookie_begin_pos = cookie_begin_pos + cookie_name.length + 1;
              cookie_end_pos = document.cookie.indexOf(";", cookie_begin_pos);
              if (cookie_end_pos == -1)
              {
                  cookie_end_pos = document.cookie.length;
              }

              return unescape(document.cookie.substring(cookie_begin_pos, cookie_end_pos));
          }
      }
      return "";
  }
  $scope.session = getCookie('pmn');
  $scope.user = getCookie('pmn_usr');
  loadUserBookings();

  console.log('Init BookingsController... ');



  $scope.book = function()
  {
    var loc = document.getElementById('gps_loc').value;

    if(!$scope.user || !$scope.session)
    {
      alert('Please login in order to make a booking.');
      console.log('session user not set, log in!');
      return;
    }

    /*if(window.session_date_issued + window.session_ttl >= (new Date().getTime()/1000))
    {
      alert('Session expired, please login in.');
      console.log('session expired, log in!');
      return;
    }*/

    if(app_date.value==null)
    {
      alert('Please choose a valid date.');
      console.log('invalid date.');
      return;
    }
    if(app_time.value==null)
    {
      alert('Please choose a valid time.');
      console.log('invalid time.');
      return;
    }

    var date =new Date(app_date.value + ' ' + app_time.value);

    if(!loc)
    {
      alert('Please click on the map to choose the location where we will be coming to pamper you.');
      console.log('location is not set.');
      return;
    }
    if(date.getDay()==1)//off on Mondays
    {
      alert('Please note that we are not available on Mondays.\nThank you.');
      console.log('we are not available on this day.');
      return;
    }
    if(!date.getTime())
    {
      alert('Please ensure that your date and time are valid.\nThank you.');
      console.log('please ensure that your date and time are valid.');
      return;
    }
    if(loc[0]=='(')
      loc = loc.substring(1);
    if(loc[loc.length-1]==')')
      loc = loc.substring(0,loc.length-1);

    //var booking = {'client_username':window.session_user, 'date':date.getTime(), 'nails': window.nails};
    var data = 'client_username' + '=' + $scope.user + '&'
                + 'date' + '=' + date.getTime() + '&'
                + 'nails' + '=' + window.nails;
    //console.log(booking);
    $http(
    {
      method:'POST',
      url:'/api/booking/add',
      headers: {'Content-Type':'application/x-www-form-urlencoded', 'session': $scope.session},
      //headers: {'Content-Type':'application/json'},
      transformRequest(obj)
      {
        //meant to convert JSON to urlencoded
        //console.log('transformRequest: %s', obj)
        return obj;
      },
      data:$.param({'client_username':$scope.user, 'date':date.getTime(), 'location': loc, 'nails': window.nails})
    }).then(function(response)
    {
      console.log(response);
    });
  }
}]);
