/**
 * Created by art on 22.05.17.
 */
export function dataClass(bootstrap){};

dataClass.prototype.createFriendsTargetListDiv = function (friends) {
    var templateFn = require('../friend-target-template.hbs');

    friends.sort((a, b) => {
        var nameA=a.first_name.toLowerCase(), nameB=b.first_name.toLowerCase()
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;

        return 0;
    });

    return templateFn({
        friends: friends
    });
};

dataClass.prototype.createFriendsDiv = function(friends) {
    var templateFn = require('../friend-template.hbs');

    friends.sort((a, b) => {
        var nameA = a.first_name.toLowerCase(), nameB = b.first_name.toLowerCase()
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;

        return 0;
    });

    return templateFn({
        friends: friends
    });
};