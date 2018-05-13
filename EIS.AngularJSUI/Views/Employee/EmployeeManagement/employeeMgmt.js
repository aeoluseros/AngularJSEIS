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
    };

    //Requests has two different arguments for ‘sending’ data on a HTTP request: params and data. 
    //Each one does something different, but in their simplest form they both accept a dictionary of keys and values.
    //(1)params is all about the query string, and so is primarily used on GET requests. The key take away here is that 
    //the data that was passed to params ended up in the URL query string.
    //(2)data works differently: it’s all about the request body.
    empMgmtObj.CreateMultipleEmployee = function (fileName) {
        var Emp;
        Emp = $http({
            method: 'Post',
            url: 'http://localhost:64776/api/Employee/CreateMultipleEmployee',
            params: fileName   //data:fileName
        }).then(function (response) {
            return response;
        }, function (error) {
            return error;
        });

        return Emp;
    };

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

    empMgmtObj.remindEmployeeById = function (eid, msg) {
        var Emps;

        Emps = $http({
            method: 'Get',
            url: 'http://localhost:64776/api/Employee/Remind',
            params: { id: eid, msgStr: msg}
        }).then(function (response) {
            return response;
        });
        return Emps;
    }


    return empMgmtObj;
});

appEIS.controller('employeeMgmtController', function ($scope, employeeMgmtService, utilityService, $window) {
    employeeMgmtService.getAll().then(function (result) {
        $scope.Emps = result;
    });

    $scope.Sort = function (col) {
        $scope.Key = col;
        $scope.AscOrDesc = !$scope.AscOrDesc;  //no need to assign initial value
    };

    $scope.CreateEmployee = function (Emp, isValid) {  //isValid is one property of form.
        if (isValid) {
            Emp.Password = utilityService.randomPassword();
            employeeMgmtService.createEmployee(Emp).then(function (result) {
                $scope.Msg = " You have successfully created " + result.EmployeeId;
                $scope.Flg = true;
                utilityService.myAlert();

                $scope.serverErrorMsgs = "";

                employeeMgmtService.getAll().then(function (result) {
                    $scope.Emps = result;
                });
            }).catch(function (error) {
                $scope.serverErrorMsgs = error.data.ModelState;
            });
        }
    };

    $scope.CreateMultipleEmployee = function () {  //isValid is one property of form.
        var file = $scope.myFile;
        var uploadUrl = 'http://localhost:64776/api/Upload/';
        utilityService.uploadFile(file, uploadUrl, $scope.eid)
            .then(function (filename) {
                console.log(filename);
                employeeMgmtService.createMultipleEmployee(fileName)
                    .then(function (result) {
                        if (result.status == 200) {
                            $scope.Msg = " You have successfully created " + result.data + " records(s)";
                            $scope.Flg = true;
                            utilityService.myAlert();
                            employeeMgmtService.getAll().then(function (result) {
                                $scope.Emps = result;
                            });
                        } else {
                            $scope.serverErrorMsgs = result.data.ModelState;
                        }
                    });
            });
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

    $scope.RemindEmployeeById = function (Emp) {
        var msg = $window.prompt('Please enter your message', 'Please update your info as soon as possible!');
        
        employeeMgmtService.remindEmployeeById(Emp.EmployeeId, msg).then(function (result) {
            if(result.status == 200){
                $scope.Msg = " Reminder email has been sent! ";
                $scope.Flg = true;
                utilityService.myAlert();
            } else {
                $scope.serverErrorMsgs = result.data.ModelState;
            }
        }).catch(function (error) {
            $scope.serverErrorMsgs = error.data;
        });
   }
});







