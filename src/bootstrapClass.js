/**
 * Created by art on 22.05.17.
 */
/** Create singleton with variables and data **/

var bootstrapClass = (function () {
    var instance;

    function createInstance() {
        var object = new Object();

        object.targetArray = [];
        object.targetList = document.getElementById('targetList');
        object.defaultList = document.getElementById('defaultList');
        object.sourceArray = [];
        object.filterContainer = document.getElementById('filterContainer');
        object.dragSrcEl = null;
        object.dragId = 0;
        object.dragId = 0;
        object.searchSrcArray = [];
        object.searchTargetArray = [];
        object.searchSourceInput = document.getElementById('searchSourceInput');
        object.searchTargetInput = document.getElementById('searchTargetInput');

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export {bootstrapClass};
