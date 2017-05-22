/**
 * Created by art on 22.05.17.
 */
import {bootstrapClass} from './bootstrapClass.js';

export function dataClass(bootstrap){
    var saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', this.saveList)

    bootstrap.targetList.addEventListener('drop', this.drop);
    bootstrap.targetList.addEventListener('dragover', this.allowDrop);
    bootstrap.defaultList.addEventListener('mousedown', (e) => {
        // delegate events for defaultList's children
        // if clicked on <li draggable="true">
        if (e.target.hasAttribute('draggable')) {
            var elem = e.target;
        } else {
            // if clicked on elements inside <li draggable="true">
            var elem = e.target.closest('li');
        }

        if (elem) {
            elem.addEventListener('dragstart', this.drag, false);
        }
    });
    bootstrap.defaultList.addEventListener('click', this.addElemInTargetList);
    bootstrap.targetList.addEventListener('click', this.deleteAddedElem);
    bootstrap.targetList.addEventListener('dragstart', () => {return false;});
    bootstrap.searchSourceInput.addEventListener('keyup', function() {
        searchSrcArray = [];

        if (bootstrap.searchSourceInput.value) {
            for (var item of bootstrap.sourceArray) {
                if (this.isMatching(item.first_name, bootstrap.searchSourceInput.value) || this.isMatching(item.last_name, bootstrap.searchSourceInput.value)) {
                    bootstrap.searchSrcArray.push(item);
                }
            }

            if (searchSrcArray) {
                bootstrap.defaultList.innerHTML = this.createFriendsDiv(bootstrap.searchSrcArray);
            }
        }
        else {
            bootstrap.defaultList.innerHTML = this.createFriendsDiv(bootstrap.sourceArray);
        }
    });
    bootstrap.searchTargetInput.addEventListener('keyup', function() {
        searchTargetArray = [];

        if (bootstrap.searchTargetInput.value) {
            for (var item of bootstrap.targetArray) {
                if (this.isMatching(item.first_name, bootstrap.searchTargetInput.value) || this.isMatching(item.last_name, bootstrap.searchTargetInput.value)) {
                    searchTargetArray.push(item);
                }
            }

            if (searchTargetArray) {
                bootstrap.targetList.innerHTML = this.createFriendsTargetListDiv(bootstrap.searchTargetArray);
            }
        }
        else {
            bootstrap.targetList.innerHTML = this.createFriendsTargetListDiv(bootstrap.targetArray);
        }
    })

};

dataClass.prototype.bootstrap = bootstrapClass.getInstance();

dataClass.prototype.allowDrop = function (ev) {
        ev.preventDefault();
};

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

dataClass.prototype.findAndRefreshElements = function (source, dest, id) {
    for (var i = 0; i < source.length; i++) {
        if (source[i].id == id) {
            dest.push(source[i]);
            source.splice(i, 1);

            return;
        }
    }
};

dataClass.prototype.drag = function (e, bootstrap) {
    // set dragSrcEl
    bootstrap.dragSrcEl = this;
    bootstrap.dragId = this.getAttribute('id');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

dataClass.prototype.drop = function(e, bootstrap) {
    var str = '',
        addedElem;

    if (e.stopPropagation) {
        // Stops some browsers from redirecting.
        e.stopPropagation();
    }

    this.findAndRefreshElements(bootstrap.sourceArray, bootstrap.targetArray, bootstrap.dragId);
    // if dragSrcEl's context not from a defaultList
    if (bootstrap.dragSrcEl != this && bootstrap.dragSrcEl != null) {

        bootstrap.targetList.innerHTML = this.createFriendsTargetListDiv(bootstrap.targetArray);
        bootstrap.defaultList.innerHTML = this.createFriendsDiv(bootstrap.sourceArray);
        // clean added dragSrcEl's context
        bootstrap.dragSrcEl = null;
    }

    // if not dragSrcEl
    return false;
};

dataClass.prototype.deleteAddedElem =  function (e, bootstrap) {
    var elemId;
    e.preventDefault();

    if (e.target.parentNode.hasAttribute('data-delete')) {
        bootstrap.elemId = e.target.closest('li').getAttribute('id');
        this.findAndRefreshElements(bootstrap.targetArray, bootstrap.sourceArray, bootstrap.elemId);

        bootstrap.targetList.innerHTML = this.createFriendsTargetListDiv(bootstrap.targetArray);
        bootstrap.defaultList.innerHTML = this.createFriendsDiv(bootstrap.sourceArray);
    }
};

dataClass.prototype.addElemInTargetList = function (e) {
    var elemId;
    e.preventDefault();

    if (e.target.parentNode.hasAttribute('data-add')) {
        elemId = e.target.closest('li').getAttribute('id');
        this.findAndRefreshElements(bootstrap.sourceArray, bootstrap.targetArray, elemId);

        bootstrap.targetList.innerHTML = this.createFriendsTargetListDiv(bootstrap.targetArray);
        bootstrap.defaultList.innerHTML = this.createFriendsDiv(bootstrap.sourceArray);
    }
};

dataClass.prototype.createFriendsDiv = function (friends) {
    var templateFn = require('../friend-template.hbs');

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

dataClass.prototype.isMatching = function (full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) != -1) {
        return true;
    }

    return false;
};

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

dataClass.prototype.saveList = function (e, bootstrap) {
    e.preventDefault();
    var serialSrcArr = JSON.stringify(bootstrap.sourceArray),
        serialTargetArr = JSON.stringify(bootstrap.targetArray);

    localStorage.setItem("serialSrcArr", serialSrcArr);
    localStorage.setItem("serialTargetArr", serialTargetArr);
}