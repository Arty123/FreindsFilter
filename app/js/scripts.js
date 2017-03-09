"use strict"

;
(function() {
    var targetList = document.getElementById('targetList'),
        filterContainer = document.getElementById('filterContainer'),
        dragSrcEl = null;

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(e) {
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function drop(e) {
        var str = '', addedElem;

        if (e.stopPropagation) {
                e.stopPropagation(); // Stops some browsers from redirecting.
            }

            // Don't do anything if dropping the same column we're dragging.
            if (dragSrcEl != this) {
            // Set the source column's HTML to the HTML of the columnwe dropped on.

            str = '<li id="addedElem" class="list__item list__item_left parent-inline clearfix">'+e.dataTransfer.getData('text/html')+'</li>';
            this.innerHTML += str;

            addedElem = document.getElementById('addedElem');
            console.log(addedElem.lastElementChild.firstElementChild.setAttribute('src', './img/delete.png'));
            addedElem.removeAttribute('id');

            dragSrcEl.remove();
        }

        return false;
    }

    targetList.addEventListener('drop', drop);
    targetList.addEventListener('dragover', allowDrop);

    filterContainer.addEventListener('mousedown', (e) => {

        if (e.target.hasAttribute('draggable')) {
            var elem = e.target;
        } else {
            var elem = e.target.closest('li');
        }

        elem.addEventListener('dragstart', drag, false);
    });
})();
