'use strict';

/**
 * Describe custom scroll on the element with stubs of compared products.
 */
angular.module('epam.productcomparison')
    .directive('comparisonStubs', ['$document', function ($document) {
        return {
            restrict: 'AE',
            scope: {
                comparisonProducts: '=',
                productsUpdates: '&'
            },
            templateUrl: 'js/app/productcomparison/templates/products-stubs.html',
            link: function(scope, wrapper, attr) {
                var scrollOffset     = 310;
                var isStubItemSynced = false;
                var parent           = wrapper.parent();
                var elem             = $(wrapper).children();
                var initialLeftPos   = parseInt(elem.css('left'));

                function parentScrollHandler() {
                    elem.css('left', initialLeftPos - $(this).scrollLeft());
                }

                // sync width of small product stub on top of the page with product attributes cell width.
                function syncStubCells() {
                    var stubItems    = elem.find('.stub-item');
                    var productsCell = parent.find('.attr-group').not('.empty-attrs').eq(0).find('.product-attr');

                    productsCell.each(function(index, item) {
                        stubItems.eq(index).width( $(item).width() );
                    });

                    elem.width( parent.find('.table').width() );

                    isStubItemSynced = !isStubItemSynced;
                }

                function pageScrollHandler() {
                    $(this).scrollTop() > scrollOffset ? elem.fadeIn(200) : elem.fadeOut(50);

                    if (!isStubItemSynced) syncStubCells();
                }

                // synchronize scroll of the compared product table with stubs items.
                parent.on('scroll', parentScrollHandler);

                $document.on('scroll', pageScrollHandler);

                // watch for compared product changes.
                scope.$watch(scope.productsUpdates, function(oldValue, newValue) {
                    if (oldValue !== newValue) { isStubItemSynced = !isStubItemSynced; }
                });
            }
        };
    }]);
