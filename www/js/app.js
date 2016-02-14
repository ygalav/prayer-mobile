(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      setTimeout(function() {
        ons.notification.alert({ message: 'tapped' });
      }, 100);
    };
  });

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
  });

  module.controller('MasterController', function($scope, $http) {
    $scope.items = {};

      var responsePromise = $http.get("http://rest.prayer.com.ua/rest/category");
      responsePromise.success(function(data) {
          $scope.items=data;
      });
      responsePromise.error(function(data) {
          alert("Problem loading data");
      });


    $scope.showDetail = function(index) {
      var responsePromise = $http.get("http://rest.prayer.com.ua/rest/category/"+index);
      responsePromise.success(function(data) {
          $scope.navi.pushPage('detail.html', {title : data.name});
      });
        responsePromise.error(function(data) {
          alert("Problem loading data");
      });
    };
  });

  module.factory('$data', function() {
      var data = {};

      data.items = [
          {
              title: 'Item 1 Title',
              label: '4h',
              desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          },
          {
              title: 'Another Item Title',
              label: '6h',
              desc: 'Ut enim ad minim veniam.'
          },
          {
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          }
      ];

      return data;
  });
})();

