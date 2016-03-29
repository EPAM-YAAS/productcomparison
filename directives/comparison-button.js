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
            controller: ['$scope', function ($scope) {
                $scope.isAdded = null;
                $scope.productId = $scope.product.id;

                ProductComparisonService.getProductIds().then(function(productIds) {
                    $scope.isAdded = productIds.some(function(id) { return id === $scope.product.id; });
                });

                $scope.addToComparison = function(e) {
                    e.preventDefault();

                    ProductComparisonService.addProductToComparison($scope.productId)
                        .then(function(isError) {

                            if (isError) return;

                            $.notify({
                                message: 'Product ' + $scope.product.name + ' was added to comparison.',
                                url: '/#!/comparison',
                                target: '_self'
                            },{
                                placement: {
                                    from: "bottom",
                                    align: "right"
                                }
                            });

                            $scope.isAdded = true;
                        });
                };

                $scope.removeFromComparison = function(e) {
                    e.preventDefault();

                    if (!$scope.isComparisonPage) {  $scope.isAdded = false; }

                    ProductComparisonService.removeProductFromComparison($scope.productId)
                        .then(function(){
                            if (!$scope.isComparisonPage) {
                                $scope.isAdded = false;
                                $.notify({
                                    message: 'Product ' + $scope.product.name + ' was removed from comparison.',
                                    url: '/#!/comparison',
                                    target: '_self'
                                },{
                                    placement: {
                                        from: "bottom",
                                        align: "right"
                                    }
                                });
                            }
                        });
                };
            }]
        };
    }]);