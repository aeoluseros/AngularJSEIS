$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});

var appEIS = angular.module('appEIS', ['ngRoute','angularUtils.directives.dirPagination']);

appEIS.config(function ($routeProvider) {
    $routeProvider.when('/Home', { templateUrl: 'Common/Home/Home.html', controller:'homeController'});
    $routeProvider.when('/Login', { templateUrl: 'Common/Login/Login.html', controller: 'loginController'});
    $routeProvider.when('/RecoverPassword', { templateUrl: 'Common/RecoverPassword/RecoverPassword.html', controller: 'recoverPasswordController'});
    $routeProvider.when('/EmployeeManagement', { templateUrl: 'Employee/EmployeeManagement/EmployeeMgmt.html', controller: 'employeeMgmtController'});
    $routeProvider.when('/EmployeeProfile/', { templateUrl: 'Employee/EmployeeUpdate/EmployeeUpdate.html', controller: 'employeeUpdateController'});
    $routeProvider.when('/Logout', { });
    $routeProvider.otherwise({redirectTo: '/Home'});
});

appEIS.factory("utilityService", function ($http) {
    utilityObj = {};
    utilityObj.randomPassword = function () {
        return Math.random().toString(36).substr(2, 10);
    };

    utilityObj.myAlert = function () {
        $('#alert').fadeTo(2000, 50).slideUp(1000, function () {
            $('#alert').slideUp(1000);  //slideUp after 1 second.
        })
    }


    return utilityObj;
})











