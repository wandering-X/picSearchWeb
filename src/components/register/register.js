angular.module("register", [])
    .directive('register', () => {
        return {
            template: require("./register.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .controller("registerCtrl", ["$scope", "$http", "$state", "$interval", "constant", "usSpinnerService",
        ($scope, $http, $state, $interval, constant, usSpinnerService) => {
            $scope.showSpinner = false;
            $scope.codeTimer = constant.validMsg.codeBtn;

            //发送短信验证码
            $scope.checkCode = () => {
                if (!constant.validType.mobile.test($scope.mobile)) {
                    $scope.codeErrorMsg = constant.validMsg.mobile;
                } else {
                    isRegister();
                }
            }

            //注册
            $scope.register = () => {
                if (!constant.validType.mobile.test($scope.mobile)) {
                    $scope.codeErrorMsg = constant.validMsg.mobile;
                } else if (!constant.validType.password.test($scope.newPassword)) {
                    $scope.codeErrorMsg = constant.validMsg.password;
                } else if ($scope.confirmPassword != $scope.password) {
                    $scope.codeErrorMsg = constant.validMsg.password;
                } else {
                    registerHttp();
                }
            }

            //发送验证码按钮是否可用
            function testDisabled1() {
                if ($scope.mobile) {
                    $scope.disabled1 = false;
                } else {
                    $scope.disabled1 = true;
                }
            }
            testDisabled1();
            $scope.isDisabled1 = () => {
                testDisabled1();
            }

            //注册按钮是否可用
            function testDisabled2() {
                if ($scope.mobile && $scope.password && $scope.confirmPassword && $scope.messageCode) {
                    $scope.disabled2 = false;
                } else {
                    $scope.disabled2 = true;
                }
            }
            testDisabled2();
            $scope.isDisabled2 = () => {
                testDisabled2();
            }

            //短信验证码请求
            function sendCodeHttp() {
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.sendMsg,
                    headers: {
                        'Content-Type': constant.header.contentType,
                        'timestamp': constant.header.timestamp,
                        'appKey': constant.header.appKey,
                        'appId': constant.header.appId
                    },
                    params: {
                        'mobile': $scope.mobile,
                        'appId': constant.header.appId
                    }
                }).then(function successCallback(response) {
                    $scope.codeErrorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        sendCodeSuccess();
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }

            //重新获取验证码
            function sendCodeSuccess() {
                $scope.codeErrorMsg = '短信验证码发送成功！';
                $scope.disabled1 = true;
                var i = 30;
                $scope.codeTimer = (i - 1) + "秒后重新获取";

                var interval = $interval(fun, 1000);

                function fun() {
                    if (i > 1) {
                        $scope.codeTimer = (i - 1) + "秒后重新获取";
                        i--;

                    } else {
                        $interval.cancel(interval);
                        $scope.disabled1 = false;
                        $scope.codeTimer = constant.validMsg.codeBtn;
                    }
                }
            }

            function registerHttp() {
                $scope.showSpinner = true;
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.register,
                    headers: {
                        'Content-Type': constant.header.contentType
                    },
                    params: {
                        'verificateCode': $scope.messageCode,
                        'loginName': $scope.mobile,
                        'password': $scope.password,
                        'appId': constant.appInfo.appId,
                        'locationCode': constant.appInfo.locationCode
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    $scope.codeErrorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        $scope.codeErrorMsg = '';
                        alert("注册成功！");
                        $state.go("frame.login", {
                            reload: false
                        });
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }

            function isRegister() {
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.isRegister,
                    params: {
                        'loginName': $scope.mobile
                    }
                }).then(function successCallback(response) {
                    $scope.codeErrorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        if (response.data.body == true) {
                            $scope.codeErrorMsg = '此号码已被注册！';
                        } else {
                            sendCodeHttp();
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }
        }
    ])