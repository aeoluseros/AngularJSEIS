appEIS.factory('employeeMgmtService', function ($http) {
    empMgmtObj = {};
    empMgmtObj.getAll = function () {
        var Emps;

        Emps = $http({
            method: 'Get',
            url: 'http://localhost:64776/api/Employee'
        }).then(function (response) {
            return response.data;
        });
        return Emps;
    }

    empMgmtObj.createEmployee = function (emp) {
        var Emp;

        Emp = $http({
            method: 'Post',
            url: 'http://localhost:64776/api/Employee',
            data: emp
        }).then(function (response) {
            return response.data;
        });
        return Emp;
    }

    empMgmtObj.deleteEmployeeById = function (eid) {
        var Emps;

        Emps = $http({
            method: 'Delete',
            url: 'http://localhost:64776/api/Employee',
            params: { id: eid }
        }).then(function (response) {
            return response.data;
        });
        return Emps;
    }

    return empMgmtObj;
});

appEIS.controller('employeeMgmtController', function ($scope, employeeMgmtService, utilityService, $window) {
    employeeMgmtService.getAll().then(function(result) {
        $scope.Emps = result;
    });

    $scope.Sort = function (col) {
        $scope.Key = col;
        $scope.AscOrDesc = !$scope.AscOrDesc;  //no need to assign initial value
    };

    $scope.CreateEmployee = function (Emp, isValid) {  //isValid is one property of form.
        if(isValid){
            Emp.Password = utilityService.randomPassword();
            employeeMgmtService.createEmployee(Emp).then(function (result) {
                $scope.Msg = " You have successfully created " + result.EmployeeId;
                $scope.Flg = true;
                utilityService.myAlert();

                $scope.serverErrorMsgs = "";

                employeeMgmtService.getAll().then(function (result) {
                    $scope.Emps = result;
                });
            }).catch(function(error){
                $scope.serverErrorMsgs = error.data.ModelState;
            });
        }
    };

    $scope.DeleteEmployeeById = function (Emp) {
        if ($window.confirm('Do you want to delete Employee with Id: ' + Emp.EmployeeId + "?")) {
            employeeMgmtService.deleteEmployeeById(Emp.EmployeeId).then(function (result) {
                $scope.Msg = " You have successfully deleted " + result.EmployeeId;
                $scope.Flg = true;
                utilityService.myAlert();

                employeeMgmtService.getAll().then(function (result) {
                    $scope.Emps = result;
                });
            }).catch(function (error) {
                $scope.serverErrorMsgs = error.data;
            });
        }
    }


});







