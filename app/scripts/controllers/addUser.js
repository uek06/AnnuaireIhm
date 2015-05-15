angular.module('pooIhmExemplesApp').controller('AddCtrl', function ($scope,$http,$rootScope) {
  $scope.isCollapsed = true;
  $scope.template = "views/users/addUser.html";

  //contiendra les informations pour ajouter un utilisateur
  $scope.newUserData={};

  $scope.newUser = function () {
    var checkName = $scope.checkString($scope.newUserData.name, "#inputNameAdd");
    var checkSurname = $scope.checkString($scope.newUserData.surname, "#inputSurnameAdd");
    if (checkName && checkSurname) {
      $('#message').html('<strong>L\'utilisateur a bien été ajouté !</strong>');
      $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Users/', $scope.newUserData)
        .success(function () {
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
            .success(function (data) {
              $scope.users = data.data;
              $scope.isCollapsed=true;
              $scope.newUserData={};
              $('#message').text('');
              $("#inputNameAdd").attr('class', 'form-group');
              $("#inputSurnameAdd").attr('class', 'form-group');
            });
        });
    }
    else {
      $('#message').html('<strong>Merci de compléter les champs</strong>');
    }
  }
});
