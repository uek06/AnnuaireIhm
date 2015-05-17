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
        angular.forEach($scope.roles2, function (value, key) {
          var buffer={};
          buffer.name = value.name;
          buffer.ProjectId = key;
          buffer.UserId = user.id;
          $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/'+value.id, buffer);
        });
        return false;
      }
      return true;
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


    $rootScope.viewUser = function (user) {
      $rootScope.roles2 = [];
      $rootScope.currentUser = user;
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id + '/Projects')
        .success(function (data) {
          $rootScope.projectsOfUser = data.data;
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + user.id + '/Roles')
            .success(function (data2) {
              angular.forEach(data2.data, function (role) {
                $scope.roles2[role.ProjectId] = role;
              });
            });
        });
      ngDialog.open({
        template: 'views/users/viewUser.html',
        controller:'UsersCtrl',
        scope : $rootScope
      });
    };

    $scope.deleteProjectInUser = function (project) {
      BootstrapDialog.show({
        message: 'Voulez-vous vraiment supprimer ' + $scope.currentUser.name + ' du projet ' + project.title + ' ?',
        title: 'Attention',
        buttons: [{
          label: 'Oui',
          cssClass: 'btn-primary',
          action: function (dialogItself) {
            //on supprimer l'utilisateur du projet
            $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id + '/Users/' + $scope.currentUser.id)
              .success(function () {
                $scope.roles = [];
                //on récupère les nouveaux projets du l'utilsateur
                $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.currentUser.id + '/Projects')
                  .success(function (data) {
                    //on met à jour les users du projet
                    $scope.projectsOfUser= data.data;
                    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $scope.currentUser.id + '/Roles')
                      .success(function (data2) {
                        //on met à jour les roles
                        angular.forEach(data2.data, function (role) {
                          $scope.roles2[role.ProjectId] = role;
                        });
                      });
                  });
              });
            dialogItself.close();
            $scope.viewProject($scope.currentProject);
          }
        }, {
          label: 'Non',
          action: function (dialogItself) {
            dialogItself.close();
            $scope.viewProject($scope.currentProject);
          }
        }]
      });
    };

  }]);
