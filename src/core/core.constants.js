(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('d3', window.d3)
        .constant('io', window.io)
        .constant('_', window._)
        .constant('api', 'http://localhost:8080');
})();
