'use strict';

angular.module('epam.productcomparison')
    .directive('comparisonButton', ['ProductComparisonService', function (ProductComparisonService) {
        return {
            restrict: 'E',
            templateUrl: 'js/app/productcomparison/templates/add-remove-to-comparison.html',
            scope: {
                product : '=',
                isComparisonPage : '='
            },
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.isAdded = null;
                $scope.productId = $scope.product.id;

                ProductComparisonService.getProductIds().then(function(productIds) {
                    $scope.isAdded = productIds.some(function(id) { return id === $scope.product.id; });
                });

                $scope.addToComparison = function(e) {
                    e.preventDefault();

                    ProductComparisonService.addProductToComparison($scope.productId)
                        .then(function(){
                            $scope.isAdded = true;
                            $rootScope.$broadcast('ADDED_TO_COMPARISON', $scope.productId);

                            $.notify({
                                message: 'Product ' + $scope.product.name + ' was added to comparison.',
                                url: '/#!/comparison',
                                target: '_self'
                            });
                        });
                };

                $scope.removeFromComparison = function(e) {
                    e.preventDefault();

                    ProductComparisonService.removeProductFromComparison($scope.productId)
                        .then(function(){
                            $scope.isAdded = false;
                            $rootScope.$broadcast('REMOVED_TO_COMPARISON', $scope.productId);

                            if ($scope.isComparisonPage) return;

                            $.notify({
                                message: 'Product ' + $scope.product.name + ' was removed from comparison.',
                                url: '/#!/comparison',
                                target: '_self'
                            });
                        });
                };
            }]
        };
    }]);