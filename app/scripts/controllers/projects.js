'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('AnnuaireUgo')
  .controller('ProjectsCtrl', ['$scope', '$http', '$routeParams', 'ngDialog','$rootScope', function ($scope, $http, $routeParams, ngDialog, $rootScope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //on récupère la base de données et on la stocke dans users
    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
      .success(function (data) {
        $rootScope.projects = data.data;
      })
      .error(function () {
        location.href = '#/404';
      });

    $rootScope.edit = {};
    $scope.template = 'views/projects/list.html';

    $scope.checkYear = function (year, balise) {
      if (year === undefined || year === '' || isNaN(year)) {
        $(balise).attr('class', 'form-group has-error');
        return false;
      }
      $(balise).attr('class', 'form-group has-success');
      return true;
    };

    $scope.updateProject = function (project) {
      var checkTitle = $scope.checkString(project.title, '#inputTitleEdit');
      var checkDescription = $scope.checkString(project.description, '#inputDescriptionEdit');
      var checkYear = $scope.checkYear(project.year, '#inputYearEdit');
      if (checkTitle && checkDescription && checkYear) {
        //modification des infos du projet
        $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id, project)
          .success(function () {
            $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
              .success(function (data) {
                $rootScope.projects = data.data;
              });
          });
        angular.forEach($scope.roles, function (value, key) {
          var buffer={};
          buffer.name = value.name;
          buffer.ProjectId = project.id;
          buffer.UserId = key;
          $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/'+value.id, buffer);
        });
        return false;
      }
      return true;
    };

    $scope.test = function () {
      console.log('test"');
      var lol = {};
      lol.name="cou";
      lol.UserId=3828;
      lol.ProjectId=690;
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/', lol);
    };

    $scope.viewProject = function (project) {
      $scope.roles = [];
      $scope.currentProject = project;
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id + '/Users')
        .success(function (data) {
          $scope.usersInProject = data.data;
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id + '/Roles')
            .success(function (data2) {
              angular.forEach(data2.data, function (role) {
                $scope.roles[role.UserId] = role;
              });
            });
        });
      ngDialog.open({
        template: 'views/projects/viewProject.html',
        scope: $scope
      });
    };

    $scope.addInput = function () {
      //var lol ='<select class="form-control"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>';
      //$('#inputsLol').append(lol);
      var newUser={};
      $scope.usersInProject.push(newUser);
    };

    $scope.deleteUserInProject = function (user) {
      BootstrapDialog.show({
        message: 'Voulez-vous vraiment supprimer ' + user.name + ' du projet ' + $scope.currentProject.title + ' ?',
        title: 'Attention',
        buttons: [{
          label: 'Oui',
          cssClass: 'btn-primary',
          action: function (dialogItself) {
            //on supprimer l'utilisateur du projet
            $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.currentProject.id + '/Users/' + user.id)
              .success(function () {
                $scope.roles = [];
                //on récupère les nouveaux utilisateurs du projet
                $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.currentProject.id + '/Users')
                  .success(function (data) {
                    //on met à jour les users du projet
                    $scope.usersInProject = data.data;
                    $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $scope.currentProject.id + '/Roles')
                      .success(function (data2) {
                        //on met à jour les roles
                        angular.forEach(data2.data, function (role) {
                          $scope.roles[role.UserId] = role;
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


    $scope.deleteProject = function (project) {
      BootstrapDialog.show({
        message: 'Voulez-vous vraiment supprimer le projet ' + project.title + ' ?',
        title: 'Attention',
        buttons: [{
          label: 'Oui',
          cssClass: 'btn-primary',
          action: function (dialogItself) {
            $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id)
              .success(function () {
                $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
                  .success(function (data) {
                    $scope.projects = data.data;
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
