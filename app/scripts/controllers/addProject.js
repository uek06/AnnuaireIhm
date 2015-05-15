angular.module('pooIhmExemplesApp').controller('AddProjectCtrl', function ($rootScope,$scope,$http) {
  $scope.isCollapsed = true;
  $scope.template = "views/projects/addProject.html";

  //contiendra les informations pour ajouter un utilisateur
  $scope.newProjectData={};

  $scope.checkYear = function (year){
      if (year === undefined || year === '' || isNaN(year)) {
        $('#inputYearAdd').attr('class', 'form-group has-error');
        return false;
      }
      $('#inputYearAdd').attr('class', 'form-group has-success');
      return true;
  }

  $scope.newProject = function () {
    var checkTitle = $scope.checkString($scope.newProjectData.title, "#inputTitleAdd");
    var checkDescription = $scope.checkString($scope.newProjectData.description, "#inputDescriptionAdd");
    var checkYear = $scope.checkYear($scope.newProjectData.year);
    if (checkTitle && checkDescription && checkYear) {
      $('#message').html('<strong>L\'utilisateur a bien été ajouté !</strong>');
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/', $scope.newProjectData)
        .success(function () {
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
            .success(function (data) {
              $rootScope.projects = data.data;
              $scope.isCollapsed=true;
              $scope.newProjectData={};
              $('#message').text('');
              $("#inputTitleAdd").attr('class', 'form-group');
              $("#inputDescriptionAdd").attr('class', 'form-group');
              $("#inputYearAdd").attr('class', 'form-group');
            });
        });
    }
    else {
      $('#message').html('<strong>Merci de compléter les champs</strong>');
    }
  }
});
