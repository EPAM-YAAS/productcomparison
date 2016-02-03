'use strict';

angular.module('ds.shared')
    .directive('spinner', function () {
        return {
            restrict: 'EA',
            scope: {
                spinnerShown: '='
            },
            template: '<div class="spinner-layer" ng-if="spinnerShown">\n    <div class="layout"></div>\n    <span us-spinner="spinnerOptions"></span>\n</div>\n',
            link: function (scope) {
                // Spinner options
                scope.spinnerOptions = {};
            }
        };
    });
