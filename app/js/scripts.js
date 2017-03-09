"use strict"

;
(function() {
    function handleDragStart(e) {
      this.style.opacity = '0.4';  // this / e.target is the source node.
    }

    var filterContainer = document.getElementById('filterContainer');
    filterContainer.addEventListener('mousedown', (e) => {
        if (e.target.hasAttribute('draggable')) {
            var elem = e.target;
        } else {
            var elem = e.target.closest('li');
        }

        function handleDragStart(e) {
          this.style.opacity = '0.4';  
        }

        elem.addEventListener('dragstart', handleDragStart, false)
    });
})();
