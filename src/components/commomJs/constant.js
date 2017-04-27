angular.module("constant", [])
    .factory("constant", [function ($scope) {
        if (localStorage.islogin) {
            localStorage.islogin = getLogin();
        } else {
            localStorage.islogin = false;
        }

        if (localStorage.accountId) {
            localStorage.accountId = getAccountId();
        } else {
            localStorage.accountId = "";
        }

        if (localStorage.accessToken) {
            localStorage.accessToken = getAccessToken();
        } else {
            localStorage.accessToken = "";
        }

        if (localStorage.mobile) {
            localStorage.mobile = getMobile();
        } else {
            localStorage.mobile = "";
        }

        function setLogin(login) {
            localStorage.islogin = login;
        }

        function getLogin() {
            var islogin = (localStorage.islogin === 'true') ? true :
                false;
            return islogin;
        }

        function setAccessToken(accessToken) {
            localStorage.accessToken = accessToken;
        }

        function getAccessToken() {
            return localStorage.accessToken;
        }

        function setAccountId(accountId) {
            localStorage.accountId = accountId;
        }

        function getAccountId() {
            return localStorage.accountId;
        }

        function setMobile(mobile) {
            localStorage.mobile = mobile;
        }

        function getMobile() {
            return localStorage.mobile;
        }

        return {
            setLogin: setLogin,
            isLogin: getLogin,
            successCode: "00000000",
            header: {
                contentType: "application/x-www-form-urlencoded",
                timestamp: "1492075692799",
                appKey: "559CEAE328FB0AF78DAC25F7303FEB8DA1BE4463",
                appId: "09250100010000"
            },

            userInfo: {
                setAccessToken: setAccessToken,
                setAccountId: setAccountId,
                accessToken: getAccessToken,
                setMobile: setMobile,
                loginName: '',
                accountId: getAccountId,
                mobile: getMobile,
                password: "",
                authCode: '',
                locationCode: '河北省'
            },
            validMsg: {
                mobile: "手机号不正确！",
                password: "密码不能少于6位！",
                newPassword: "密码输入不一致！",
                codeBtn: "获取短信验证码"
            },
            validType: {
                mobile: new RegExp("^1[34578]\\d{9}$"),
                password: new RegExp("^\\S{6,20}$")
            },
            appInfo: {
                appId: "09250100010000",
                timestamp: '1492075692799',
                appKey: '559CEAE328FB0AF78DAC25F7303FEB8DA1BE4463'
            },
            ajaxUrl: {
                login: 'http://192.168.150.181/hswy-basic-web/basic/oauth2/clientLogin',
                sendMsg: 'http://192.168.150.181/hswy-basic-web/basic/account/verificate/send',
                userInfo: 'http://192.168.150.181/hswy-basic-web/basic/account/information',
                verifyCode: 'http://192.168.150.181/hswy-basic-web/basic/account/verificate/verify',
                findLogin: 'http://192.168.150.181/hswy-basic-web/basic/account/password/retrieve',
                register: 'http://192.168.150.181/hswy-basic-web/basic/account/register',
                isRegister: 'http://192.168.150.181/hswy-basic-web/basic/account/existed',
                reset: 'http://192.168.150.181/hswy-basic-web/basic/account/password/reset'
            }
        }
    }])
