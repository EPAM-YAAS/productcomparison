'use strict';

angular.module('epam.productcomparison')
    .directive('categoriesList', [function () {
        return {
            restrict: 'E',
            templateUrl: 'js/app/productcomparison/templates/categories-list.html',
            scope: {
                categories : '=',
                onCatSelect : '=',
                onCatRemove : '='
            },
            link: function (scope) {
                scope.setSelectedCategory = function(ev, catID) {
                    $('.comparison-cat-list-item').removeClass('highlighted-cat');
                    $(ev.currentTarget).addClass('highlighted-cat');
                    scope.onCatSelect(catID);
                };
            }
        };
    }]);