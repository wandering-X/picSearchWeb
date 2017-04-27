angular.module("reset", [])
    .directive('reset', () => {
        return {
            template: require("./reset.html"),
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
    .controller("resetCtrl", ["$scope", "$http", "$state", "usSpinnerService", "constant",
        ($scope, $http, $state, usSpinnerService, constant) => {
            $scope.showSpinner = false; //loading加载

            //提交按钮是否可用
            function testDisabled() {
                if ($scope.password && $scope.newPassword && $scope.comfirmPassword) {
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
            $scope.userReset = () => {
                if (!constant.validType.password.test($scope.newPassword)) {
                    $scope.errorMsg = "新" + constant.validMsg.password;
                } else if ($scope.comfirmPassword != $scope.newPassword) {
                    $scope.errorMsg = constant.validMsg.newPassword;
                } else {
                    console.log(constant.userInfo.mobile());
                    resetHttp();
                    
                }
            }

            function resetHttp() {
                $http({
                    method: "POST",
                    url: constant.ajaxUrl.reset,
                    headers: {
                        "Content-Type": constant.header.contentType
                    },
                    params: {
                        'loginName': constant.userInfo.mobile(),
                        'oldPassword': $scope.password,
                        'newPassword': $scope.newPassword,
                        'token': constant.userInfo.accessToken()
                    }
                }).then(function successCallback(response) {
                    $scope.showSpinner = false;
                    $scope.errorMsg = response.data.head.msg;
                    console.log(response);
                    if (response.data.head.code == constant.successCode) {
                        alert('密码修改成功！');
                        $state.go("frame.loginInfo", {reload: false});
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }
        }
    ])