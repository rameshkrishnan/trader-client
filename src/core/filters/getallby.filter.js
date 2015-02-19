// Filter all items from a collection for the specified Key.
// Usage:
//     $filter('getAllBy')('id', id, users);
//  => Array of "Username"

(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('getAllBy', getAllBy);

    getAllBy.$inject = ['$filter'];
    /* @ngInject */
    function getAllBy($filter) {
        return function(keyFind, valueFind, collection) {
            var i=0, len = collection.length, items = [];
            for(;i<len;i++){
                if(collection[i][keyFind] === valueFind){
                    items.push(collection[i]);
                }
            }
            return items;
        };
    }

})();
