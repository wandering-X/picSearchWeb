require("./login_info.css");

angular.module("loginInfo", [])
    .directive('loginInfo', () => {
        return {
            template: require("./login_info.html"),
            replace: true,
            restrict: "E",
            scope: {}
        }
    })
    .controller("loginInfoCtrl", ["$scope", "$http", "$state", "constant",
        ($scope, $http, $state, constant) => {
            $scope.isLogin = constant.isLogin();
            if ($scope.isLogin) {
                $http({
                    method: "GET",
                    url: constant.ajaxUrl.userInfo,
                    params: {
                        'accountId': constant.userInfo.accountId(),
                        'token': constant.userInfo.accessToken()
                    }
                }).then(function successCallback(response) {
                    if (response.data.head.code == constant.successCode) {
                        $scope.mobile = response.data.body.mobile;
                    }
                }, function errorCallback(response) {
                    console.log(response.data.head.msg);
                });
            }

            $scope.openLogin = () => {
                window.open($state.href("frame.login", {
                    reload: false
                }), '_blank');
            }

            $scope.openReset = () => {
                constant.userInfo.setMobile($scope.mobile);
                $state.go("frame.reset", {
                    reload: false
                });
            }

            $scope.userQuit = () => {
                $scope.isLogin = false;
                localStorage.clear();
            }
        }
    ])