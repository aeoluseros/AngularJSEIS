﻿$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});

var appEIS = angular.module('appEIS', ['ngRoute', 'angularUtils.directives.dirPagination', 'ngCookies','angular-loading-bar']);


//run function get calld whenever I run the application
appEIS.run(function ($rootScope, $cookies, $http) {
    if ($cookies.get("Auth") == null) {
        $cookies.put("Auth", "false");
    }
    $rootScope.Auth = $cookies.get("Auth");
    $http.defaults.headers.common['my_Token'] = '123456789'; //TODO: move this token to configuration file and read from C#.
});

appEIS.factory('myHttpInterceptor', function ($q, $window) {
    return {
        response: function (response) {
            return response;
        },
        responseError: function (response) {
            if (response.status == 500) {
                $window.alert(response.statusText);  //display the error message in an alert box.
                //we could also use $rootScope to carry the message and display on the page.
            }
            return $q.reject(response);
        }
    };
});

appEIS.config(function ($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
    $routeProvider.when('/Home', { templateUrl: 'Views/Common/Home/Home.html', controller:'homeController'});
    $routeProvider.when('/Login', { templateUrl: 'Views/Common/Login/Login.html', controller: 'loginController'});
    $routeProvider.when('/RecoverPassword', { templateUrl: 'Views/Common/RecoverPassword/RecoverPassword.html', controller: 'recoverPasswordController'});
    $routeProvider.when('/EmployeeManagement', { templateUrl: 'Views/Employee/EmployeeManagement/EmployeeMgmt.html', controller: 'employeeMgmtController'});
    $routeProvider.when('/EmployeeProfile/:EmployeeId?', { templateUrl: 'Views/Employee/EmployeeUpdate/EmployeeUpdate.html', controller: 'employeeUpdateController'});
    $routeProvider.when('/Logout', {
        resolve: {
            auth: function ($rootScope, $location, $cookies) {
                $cookies.put('Auth', 'false');
                $rootScope.Auth = $cookies.get('Auth');
                $cookies.put("EmpSignIn", null);
                $rootScope.EmpSignIn = $cookies.get("EmpSignIn");

                $location.path('/Login');
            }
        }
    });
    $routeProvider.otherwise({ redirectTo: '/Home' });
    $locationProvider.html5Mode(true);
});


appEIS.controller("appEISController", function ($scope, $rootScope, $location, $cookies, utilityService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var Guest = ['/Home', '/RecoverPassword'];
        var User = ['/Home', '/Logout', '/EmployeeProfile/:EmployeeId?'];
        var Admin = ['/Home', '/Logout', '/EmployeeProfile/:EmployeeId?', '/EmployeeManagement'];


        //$route = $location.url()
        if ($rootScope.Auth == 'false' && next.$$route != null && $.inArray(next.$$route.originalPath, Guest) == -1) {
            $location.path('/Login');
        } else {
            if ($cookies.get("EmpSignIn") != null){
                $rootScope.EmpSignIn = JSON.parse($cookies.get("EmpSignIn"));

                if ($rootScope.EmpSignIn!=null){
                    role = $rootScope.EmpSignIn.Role.RoleCode;

                    if (role == 'A' && next.$$route!=null && $.inArray(next.$$route.originalPath, Admin) == -1) {
                        $location.path('/Home');
                    }
                    else if (role == 'U' && next.$$route != null && $.inArray(next.$$route.originalPath, User) == -1) {
                        $location.path('/Home');
                    }


                    utilityService.getFile("http://localhost:64776/api/Upload/", $rootScope.EmpSignIn.EmployeeId).then(function (result) {
                        $rootScope.imgSideBar = result;
                    });
                }

            } else {
                $location.path('/Home');
            }
        }
    });
});



appEIS.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);  //read the first file
                });
            });
        }
    };
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

    utilityObj.uploadFile = function (file, uploadUrl, eid) {
        var fd = new FormData();
        fd.append('file', file);

        var Img;
        Img = $http({
            method: 'Post',
            url: uploadUrl + eid,
            data: fd,     //will be saved in HttpContext.Current.Request;
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }  //remember the Content-Type should be undefined
        }).then(function (response) {
            return response.data;
        }, function (error) { 
            return error.data;
        });

        return Img;
    }

    utilityObj.getFile = function (getFileUrl, eid) {
        var Emps;

        Emps = $http({ method: 'Get', url: getFileUrl, params: { Id: eid } }).
            then(function (response) {
                return response.data;
            });

        return Emps;
    };

    return utilityObj;
})










