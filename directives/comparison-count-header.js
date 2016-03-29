'use strict';

angular.module('epam.productcomparison')
    .directive('comparisonCount', ['ProductComparisonService', '$state', function (ProductComparisonService, $state) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'js/app/productcomparison/templates/comparison-count.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                ProductComparisonService.getProductIds().then(function(data) {
                    $scope.numberOfProductsInComparison = data.length || '';
                });

                // initiate compared products data loading for dropdown with categories.
                ProductComparisonService.getComparison();

                // Watch for compared products count
                $rootScope.$watch(ProductComparisonService.getProductsCount, function(newVal) {
                    $scope.numberOfProductsInComparison = newVal || '';
                });

                // Watch for categories of compared products count
                $rootScope.$watch(ProductComparisonService.getProductsCategories, function(newVal, oldVal) {
                    if (newVal !== oldVal) { $scope.categories = newVal; }
                });

                // Generate link to comparison page with related category's id
                $scope.getRelatedLink = function(catID) { return $state.href('base.comparison', { catID : catID }); };
            }]
        };
    }]);