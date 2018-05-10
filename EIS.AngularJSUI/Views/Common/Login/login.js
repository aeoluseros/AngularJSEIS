appEIS.factory('loginService', function ($http) {
    loginObj = {};
    loginObj.getByEmp = function (employee) {
        var Emp;
        Emp = $http({
            method: 'Post',
            url: 'http://localhost:64776/api/Login',
            data: employee
        }).then(function (response) {
            return response.data;
        }, function (error) {
            return error.data;
        });

        return Emp;
    }

    return loginObj;
})

appEIS.controller('loginController', function ($scope, loginService, $cookies, $rootScope, $location) {
    $scope.Login = function (emp, IsValid) {
        if (IsValid) {
            loginService.getByEmp(emp)
                .then(function (result) {
                    if (result.ModelState == null) {
                        //in first attempt, if you get any error, before the second attempt we should clear all that.
                        $scope.Emp = result;
                        $scope.errorMsgs = "";

                        //we're creating two cookies variables, and storing those values in two route-scope variables: one is
                        //Authentication check -- Auth, and the other is the information about the Employee: EmpSignIn.
                        $cookies.put("Auth", "true");  //save in cookie that authentication is true
                        $rootScope.Auth = $cookies.get("Auth"); //save into rootScope and could be accessed through anywhere in the portal

                        $cookies.put("EmpSignIn", JSON.stringify($scope.Emp));  //save in cookie
                        $rootScope.EmpSignIn = JSON.parse($cookies.get("EmpSignIn"));  //save into rootScope as well

                        $location.path('/');  //after login, redirect to /.
                    } else {
                        $scope.serverErrorMsgs = result.ModelState;
                    }
                });
        }
    }


});

