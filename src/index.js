require('./index.css');

import {loginClass} from './loginClass.js';
import {dataClass} from './dataClass.js';
import {bootstrapClass} from './bootstrapClass.js';

var login = new loginClass(),
    data = new dataClass(),
    bootstrap = bootstrapClass.getInstance();

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(e) {
    // set dragSrcEl
    dragSrcEl = this;
    dragId = this.getAttribute('id');

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function drop(e) {
    var str = '',
        addedElem;

    if (e.stopPropagation) {
            // Stops some browsers from redirecting.
            e.stopPropagation();
        }

        findAndRefreshElements(sourceArray, targetArray, dragId);
        // if dragSrcEl's context not from a defaultList
        if (dragSrcEl != this && dragSrcEl != null) {

        targetList.innerHTML = createFriendsTargetListDiv(targetArray);
        defaultList.innerHTML = createFriendsDiv(sourceArray);
        // clean added dragSrcEl's context
        dragSrcEl = null;
    }

    // if not dragSrcEl
    return false;
}

targetList.addEventListener('drop', drop);
targetList.addEventListener('dragover', allowDrop);

defaultList.addEventListener('mousedown', (e) => {
    // delegate events for defaultList's children
    // if clicked on <li draggable="true">
    if (e.target.hasAttribute('draggable')) {
        var elem = e.target;
    } else {
        // if clicked on elements inside <li draggable="true">
        var elem = e.target.closest('li');
    }

    if (elem) {
        elem.addEventListener('dragstart', drag, false);
    }
});

defaultList.addEventListener('click', addElemInTargetList);
targetList.addEventListener('click', deleteAddedElem);

// deny drag'n'drop behavior for targetList
targetList.addEventListener('dragstart', () => {return false;})

searchSourceInput.addEventListener('keyup', function() {
    searchSrcArray = [];

    if (searchSourceInput.value) {
        for (var item of sourceArray) {
            if (isMatching(item.first_name, searchSourceInput.value) || isMatching(item.last_name, searchSourceInput.value)) {
                searchSrcArray.push(item);
            }
        }

        if (searchSrcArray) {
            defaultList.innerHTML = createFriendsDiv(searchSrcArray);
        }
    }
    else {
        defaultList.innerHTML = createFriendsDiv(sourceArray);
    }
})

searchTargetInput.addEventListener('keyup', function() {
    searchTargetArray = [];

    if (searchTargetInput.value) {
        for (var item of targetArray) {
            if (isMatching(item.first_name, searchTargetInput.value) || isMatching(item.last_name, searchTargetInput.value)) {
                searchTargetArray.push(item);
            }
        }

        if (searchTargetArray) {
            targetList.innerHTML = createFriendsTargetListDiv(searchTargetArray);
        }
    }
    else {
        targetList.innerHTML = createFriendsTargetListDiv(targetArray);
    }
})

saveBtn.addEventListener('click', saveList)

//login()
//    .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
//    .then(result => {
//            if (localStorage['serialTargetArr']) {
//                targetArray = JSON.parse(localStorage.getItem(['serialTargetArr']));
//                targetList.innerHTML = createFriendsTargetListDiv(targetArray);
//            }
//
//            if (localStorage['serialSrcArr']) {
//                sourceArray = JSON.parse(localStorage.getItem(['serialSrcArr']));
//                defaultList.innerHTML = createFriendsDiv(sourceArray);
//            } else {
//                sourceArray = result.items;
//                defaultList.innerHTML = createFriendsDiv(sourceArray);
//            }
//        })
//    .catch(() => alert('всё плохо'));




login.instance(bootstrap, data);
