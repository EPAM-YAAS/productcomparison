'use strict';

angular.module('epam.productcomparison')
    .factory('ProductComparisonRest', ['Restangular', function(Restangular) {
        return {
            comparison: Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl('https://api.yaas.io/epam/productcomparison/b1');
            })
        };
    }]);