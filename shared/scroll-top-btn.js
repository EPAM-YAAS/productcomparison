'use strict';

angular.module('ds.shared')
    .directive('scrollTopBtn', ['$window', '$document', function ($window, $document) {
        return {
            restrict: 'EA',
            scope: {},
            template: '<button ng-show="btnShown" ng-click="scrollToTop()" type="button" id="to-top-btn" class="btn btn-link back-to-top-button pull-left menu">\n    <span class="hyicon hyicon-chevron-bold-up" />\n</button>',
            link: function(scope) {

                scope.scrollToTop = function() { $window.scrollTo(0, 0); };

                $document.on('scroll', function() {
                    scope.btnShown = $(this).scrollTop() > 10;
                    scope.$applyAsync();
                });
            }
        };
    }]);