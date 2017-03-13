require('./index.css');

var filterContainer = document.getElementById('filterContainer'),
    dragSrcEl = null, dragId = 0,
    sourceArray = [], targetArray = [],
    searchSrcArray = [], searchTargetArray = [],
    targetList = document.getElementById('targetList'),
    defaultList = document.getElementById('defaultList'),
    searchSourceInput = document.getElementById('searchSourceInput'),
    searchTargetInput = document.getElementById('searchTargetInput');

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

function findAndRefreshElements(source, dest, id) {
    for (var i = 0; i < source.length; i++) {
        if (source[i].id == id) {
            dest.push(source[i]);
            source.splice(i, 1);

            return;
        }
    }
}

function deleteAddedElem(e) {
    var elemId;
    e.preventDefault();

    if (e.target.parentNode.hasAttribute('data-delete')) {
        elemId = e.target.closest('li').getAttribute('id');
        findAndRefreshElements(targetArray, sourceArray, elemId);

        targetList.innerHTML = createFriendsTargetListDiv(targetArray);
        defaultList.innerHTML = createFriendsDiv(sourceArray);
    }
}

function addElemInTargetList(e) {
    var elemId;
    e.preventDefault();

    if (e.target.parentNode.hasAttribute('data-add')) {
        elemId = e.target.closest('li').getAttribute('id');
        findAndRefreshElements(sourceArray, targetArray, elemId);

        targetList.innerHTML = createFriendsTargetListDiv(targetArray);
        defaultList.innerHTML = createFriendsDiv(sourceArray);
    }
}

function login() {
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
}

function callAPI(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, function(result) {
            if (result.error) {
                reject();
            } else {
                resolve(result.response);
            }
        });
    });
}

function createFriendsDiv(friends) {
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
}

function isMatching(full, chunk) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) != -1) {
        return true;
    }

    return false;
}

function createFriendsTargetListDiv(friends) {
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
}

function saveList(e) {
    e.preventDefault();
    var serialSrcArr = JSON.stringify(sourceArray),
        serialTargetArr = JSON.stringify(targetArray);

    localStorage.setItem("serialSrcArr", serialSrcArr);
    localStorage.setItem("serialTargetArr", serialTargetArr);
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

login()
    .then(() => callAPI('friends.get', { v: 5.62, fields: ['city', 'country', 'photo_100'] }))
    .then(result => {
            if (localStorage['serialTargetArr']) {
                targetArray = JSON.parse(localStorage.getItem(['serialTargetArr']));
                targetList.innerHTML = createFriendsTargetListDiv(targetArray);
            }

            if (localStorage['serialSrcArr']) {
                sourceArray = JSON.parse(localStorage.getItem(['serialSrcArr']));
                defaultList.innerHTML = createFriendsDiv(sourceArray);
            } else {
                sourceArray = result.items;
                defaultList.innerHTML = createFriendsDiv(sourceArray);
            }
        })
    .catch(() => alert('всё плохо'));
