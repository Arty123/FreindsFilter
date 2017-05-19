/**
 * Created by art on 19.05.17.
 */

export function loginClass() {
}

loginClass.prototype.callAPI = function (method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
};

loginClass.prototype.login = function () {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5919739
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
};

loginClass.prototype.instance = function(dataClass) {
    console.log(dataClass);
    this.login()
        .then(() => this.callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
        .then(result => {
            if (localStorage['serialTargetArr']) {
                dataClass.targetArray = JSON.parse(localStorage.getItem(['serialTargetArr']));
                dataClass.targetList.innerHTML = dataClass.createFriendsTargetListDiv(dataClass.targetArray);
            }

            if (localStorage['serialSrcArr']) {
                dataClass.sourceArray = JSON.parse(localStorage.getItem(['serialSrcArr']));
                dataClass.defaultList.innerHTML = dataClass.createFriendsDiv(dataClass.sourceArray);
            } else {
                dataClass.sourceArray = result.items;
                dataClass.defaultList.innerHTML = dataClass.createFriendsDiv(dataClass.sourceArray);
            }
        })
        .catch((e) => alert(e));
};


