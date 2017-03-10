"use strict"

;
(function() {
    var filterContainer = document.getElementById('filterContainer'),
        dragSrcEl = null,
        targetList = document.getElementById('targetList'),
        defaultList = document.getElementById('defaultList');

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(e) {
        // set dragSrcEl
        dragSrcEl = this;

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

            // if dragSrcEl's context not from a defaultList
            if (dragSrcEl != this && dragSrcEl != null) {

            // set created element
            str = '<li id="addedElem" class="list__item list__item_left parent-inline clearfix">'+e.dataTransfer.getData('text/html')+'</li>';
            this.innerHTML += str;

            // get created element in targetList
            addedElem = document.getElementById('addedElem');

            // set data-attributes and img source of new element
            setTargetListProperties(addedElem);

            // deny drag'n'drop behavior for new element
            addedElem.addEventListener('dragstart', () => {return false;})
            // remove id attribute
            addedElem.removeAttribute('id');

            // remove dragSrcEl element from defaultList
            dragSrcEl.remove();

            // clean added dragSrcEl's context
            dragSrcEl = null;
        }

        // if not dragSrcEl
        return false;
    }

    function deleteAddedElem(e) {
        var newNode;

        if (e.target.parentNode.hasAttribute('data-delete')) {
            // clone current node in targetList, because it will be removed further
            newNode = e.target.parentNode.parentNode.cloneNode(true);

            // set DEFAULT properties for element (draggable="true", .. etc.)
            setDefaultListProperties(newNode);
            // append clone
            defaultList.appendChild(newNode);

            // remove element from targetList
            e.target.parentNode.parentNode.remove();
        }
    }

    function setDefaultListProperties(elem) {
        // set draggable attribute
        elem.setAttribute('draggable', 'true');
        // set add image
        elem.lastElementChild.firstElementChild.setAttribute('src', './img/add.png');
    }

    function setTargetListProperties (elem) {
        var deleteImg,
            deleteBtn;

        // set delete attribute
        deleteBtn = elem.lastElementChild;
        deleteBtn.setAttribute('data-delete', 'true');

        //set delete image
        deleteImg = elem.lastElementChild.firstElementChild;
        deleteImg.setAttribute('src', './img/delete.png');
    }

    function addElemInTargetList(e) {
        var newNode;

        //check link's data-add attribute
        if (e.target.parentNode.hasAttribute('data-add')) {
            // clone current node in targetList, because it will be removed further
            newNode = e.target.parentNode.parentNode.cloneNode(true);

            // set TARGET properties for element (data-delete, .. etc.)
            setTargetListProperties(newNode);
              // append clone
            targetList.appendChild(newNode);

            // remove element from targetList
            e.target.parentNode.parentNode.remove();
        }
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
})();
