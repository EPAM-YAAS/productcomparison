'use strict';

angular.module('epam.productcomparison')
    .directive('comparisonCount', ['ProductComparisonService', function (ProductComparisonService) {
        return {
            restrict: 'EA',
            templateUrl: 'js/app/productcomparison/templates/comparison-count.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

                function UpdateState(){
                    ProductComparisonService.getProductIds().then(function(data) {
                        $scope.numberOfProductsInComparison = data.length || '';
                    });
                }

                UpdateState();

                $rootScope.$on('ADDED_TO_COMPARISON', UpdateState);
                $rootScope.$on('REMOVED_TO_COMPARISON', UpdateState);
            }]
        };
    }]);