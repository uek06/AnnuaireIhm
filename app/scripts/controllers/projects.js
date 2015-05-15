'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('ProjectsCtrl', ['$rootScope','$scope', '$http', '$routeParams', 'ngDialog', function ($rootScope, $scope, $http, $routeParams, ngDialog) {
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

    $rootScope.edit={};
    $scope.template = "views/projects/list.html";

    $scope.updateProject = function (project) {
      var checkTitle = $scope.checkString(project.title, "#inputTitleEdit");
      var checkDescription= $scope.checkString(project.description, "#inputDescriptionEdit");
      if (checkTitle && checkDescription) {
        $http.put('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + project.id, project);
        return false;
      }
      return true;
    }

    $scope.viewProject = function (project) {
      $rootScope.currentProject = project;
      ngDialog.open({
        template: 'views/projects/viewProject.html',
        controller: 'ProjectsCtrl'
      });
    }


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
