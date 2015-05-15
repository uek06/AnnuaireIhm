'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('UsersCtrl', ['$rootScope','$scope', '$http', '$routeParams', 'ngDialog', function ($rootScope, $scope, $http, $routeParams, ngDialog, $modal) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //on récupère la base de données et on la stocke dans users
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
      .success(function (data) {
        $scope.users = data.data;
      })
      .error(function () {
        location.href = '#/404';
      });

    $rootScope.edit={};

    $rootScope.checkString = function (name, balise) {
      if (name === undefined || name === '') {
        $(balise).attr('class', 'form-group has-error');
        return false;
      }
      $(balise).attr('class', 'form-group has-success');
      return true;
    }

    $scope.updateUser = function (user) {
      var checkName = $scope.checkString(user.name, "#inputNameEdit");
      var checkSurname = $scope.checkString(user.surname, "#inputSurnameEdit");
      if (checkName && checkSurname) {
        var jsonUser = {};
        jsonUser.name = user.name;
        jsonUser.surname = user.surname;
        $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id, jsonUser);
        return false;
      }
      return true;
    }

    $scope.viewUser = function (user) {
      $rootScope.currentUser = user;
      ngDialog.open({
        template: 'views/users/viewUser.html',
        controller: 'UsersCtrl'
      });
    }


    $scope.deleteUser = function (user) {
      BootstrapDialog.show({
        message: 'Voulez-vous vraiment supprimer l\'utilisatateur ' + user.name + ' ' + user.surname + ' ?',
        title: 'Attention',
        buttons: [{
          label: 'Oui',
          cssClass: 'btn-primary',
          action: function (dialogItself) {
            $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id)
              .success(function () {
                $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
                  .success(function (data) {
                    $scope.users = data.data;
                  });
              });
            dialogItself.close();
          }
        }, {
          label: 'Non',
          action: function (dialogItself) {
            dialogItself.close();
          }
        }]
      });

    }

    if ($routeParams.userId) {
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId)
        .success(function (data) {
          if (data.status == "success") {
            //$scope.currentUser = data.data;
          }
        });
    }

  }]);
