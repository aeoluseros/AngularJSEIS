appEIS.controller('recoverPasswordController', function ($scope, recoveryPasswordService, utilityService) {
    $scope.RecoverPassword = function (emp, IsValid) {
        if (IsValid) {
            recoveryPasswordService.getByEmp(emp).then(function (result) {
                if (result.status == 200) {
                    $scope.Msg = " Your login credential has been emailed. Kindly check your email.";
                    $scope.Flg = true;
                    $scope.serverErrorMsgs = "";
                    utilityService.myAlert();
                } else {
                    $scope.serverErrorMsgs = result.ModelState;
                }
            });
        }
    };
});

appEIS.factory('recoveryPasswordService', function ($http, $rootScope) {
    recoverPasswordObj = {};
    recoverPasswordObj.getByEmp = function (employee) {
        var Emp;
        Emp = $http({
            method: 'GET',
            url: 'http://localhost:64776/api/Login/RecoverPassword',
            params: { empEmail: employee.Email }  //for GET method, API is expecting string, while for POST, we could use JSON
        }).then(function (response) {
            return response;
        }, function (error) {
            return error;
        });
        return Emp;
    }

    return recoverPasswordObj;
});