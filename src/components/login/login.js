require("./css/login.css")

angular.module("login", [])
    .directive('login', () => {
        return {
            template: require("./login.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setTheme('white', {
            radius: 6,
            width: 2,
            length: 5,
            color: '#fff',
            position: 'absolute',
            top: '47px',
            left: '195px'
        });
    }])
    .controller("loginCtrl", ["$scope", "$http", "$state", "usSpinnerService", "constant",
        ($scope, $http, $state, usSpinnerService, constant) => {
            $scope.showSpinner = false; //loading加载

            //登录按钮是否可用
            function testDisabled() {
                if ($scope.loginname && $scope.loginpsd) {
                    $scope.disabled = false;
                } else {
                    $scope.disabled = true;
                }
            }

            testDisabled();

            $scope.isDisabled = () => {
                testDisabled();
            }

            //请求服务端前，先进行表单验证
            $scope.userLogin = () => {
                if (!constant.validType.mobile.test($scope.loginname)) {
                    $scope.errorMsg = constant.validMsg.mobile;
                } else if (!constant.validType.password.test($scope.loginpsd)) {
                    $scope.errorMsg = constant.validMsg.password;
                } else {
                    $scope.showSpinner = true;
                    loginHttp();
                }
            }

            //打开找回密码
            $scope.openLoginFind = () => {
                $state.go("frame.loginFind", {
                    reload: false
                });
            }

            //打开注册页面
            $scope.openRegister = () => {
                $state.go("frame.register", {
                    reload: false
                });
            }

            //POST请求服务端
            function loginHttp() {
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.login,
                    headers: {
                        "Content-Type": constant.header.contentType
                    },
                    params: {
                        'loginName': $scope.loginname,
                        'password': $scope.loginpsd,
                        'appId': constant.appInfo.appId
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    $scope.errorMsg = response.data.head.msg;
                    if (response.data.head.code == constant.successCode) {
                        constant.userInfo.setAccountId(response.data.body.accountInfo.accountId);
                        constant.userInfo.setAccessToken(response.data.body.accessToken);
                        constant.setLogin(true);

                        $state.go("frame.loginInfo", {reload: false});
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }
        }
    ])