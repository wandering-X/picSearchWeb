require("./login_find.css")

angular.module("loginFind", [])
    .directive('loginFind', () => {
        return {
            template: require("./login_find.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setTheme('white1', {
            radius: 6,
            width: 2,
            length: 5,
            color: '#fff',
            position: 'absolute',
            top: '48px',
            left: '195px'
        });
    }])
    .controller("loginFindCtrl", ["$scope", "$http", "$state", "$interval", "constant", "usSpinnerService",
        ($scope, $http, $state, $interval, constant, usSpinnerService) => {
            $scope.showSpinner = false;
            $scope.codeTimer = constant.validMsg.codeBtn;

            //发送短信验证码
            $scope.checkCode = () => {
                if (!constant.validType.mobile.test($scope.mobile)) {
                    $scope.codeErrorMsg = constant.validMsg.mobile;
                } else {
                    sendCodeHttp();
                    $scope.codeErrorMsg = '';
                }
            }

            //提交找回密码
            $scope.loginFind = () => {
                if (!constant.validType.mobile.test($scope.mobile)) {
                    $scope.codeErrorMsg = constant.validMsg.mobile;
                } else if (!constant.validType.password.test($scope.newPassword)) {
                    $scope.codeErrorMsg = constant.validMsg.password;
                } else if ($scope.confirmPassword != $scope.newPassword) {
                    $scope.codeErrorMsg = constant.validMsg.newPassword;
                } else {
                    verifyCode();
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

            //提交按钮是否可用
            function testDisabled2() {
                if ($scope.mobile && $scope.newPassword && $scope.confirmPassword && $scope.messageCode) {
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

            //校验短信验证码
            function verifyCode() {
                $scope.showSpinner = true;
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.verifyCode,
                    headers: {
                        'Content-Type': constant.header.contentType
                    },
                    params: {
                        'verificateCode': $scope.messageCode,
                        'mobile': $scope.mobile
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    $scope.codeErrorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        constant.authCode = response.data.body;
                        loginFindHttp();
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }

            function loginFindHttp() {
                $scope.showSpinner = true;
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.findLogin,
                    headers: {
                        'Content-Type': constant.header.contentType
                    },
                    params: {
                        'verificateCode': $scope.messageCode,
                        'loginName': $scope.mobile,
                        'newPassword': $scope.newPassword,
                        'authCode': constant.authCode
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    $scope.codeErrorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        $scope.codeErrorMsg = '';
                        alert("找回密码成功！");
                        $state.go("frame.login", {
                            reload: false
                        });
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }
        }
    ])