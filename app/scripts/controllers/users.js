'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('AnnuaireUgo')
  .controller('UsersCtrl', ['$scope', '$http', '$routeParams', 'ngDialog','$rootScope', function ($scope, $http, $routeParams, ngDialog,$rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //on récupère la base de données et on la stocke dans users
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
      .success(function (data) {
        $rootScope.users = data.data;
      })
      .error(function () {
        location.href = '#/404';
      });

    $rootScope.edit={};
    $scope.template = "views/users/list.html";

    $rootScope.checkString = function (name, balise) {
      if (name === undefined || name === '') {
        $(balise).attr('class', 'form-group has-error');
        return false;
      }
      $(balise).attr('class', 'form-group has-success');
      return true;
    };

    $scope.updateUser = function (user) {
      var checkName = $scope.checkString(user.name, "#inputNameEdit");
      var checkSurname = $scope.checkString(user.surname, "#inputSurnameEdit");
      if (checkName && checkSurname) {
        $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id, user)
          .success(function () {
            $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
              .success(function (data) {
                $rootScope.users = data.data;
              });
          });
        return false;
      }
      return true;
    };

    $rootScope.viewUser = function (user) {
      $rootScope.currentUser = user;
      ngDialog.open({
        template: 'views/users/viewUser.html',
        controller:'UsersCtrl',
        scope : $rootScope
      });
    };


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
                    $rootScope.users = data.data;
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

    };
  }]);
