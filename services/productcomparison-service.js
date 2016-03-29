'use strict';

angular.module('epam.productcomparison')
    .factory('ProductComparisonService', ['ProductComparisonRest',
        function (ProductComparisonRest) {
            // For sharing comparison products count and compared categories
            var productsCount = 0;
            var comparedCategories = null;

            /**
             * Added product to comparison and then save count of available products in comparison.
             * @param {Number} productId
             * @returns {Promise}
             */
            function addProductToComparison(productId) {
                return ProductComparisonRest.comparison
                    .one('products', productId).post()
                    .then(getProductIds)
                    .then(function(data) { productsCount = data.length; })
                    .catch(handleError);
            }
            
            function handleError(response){
                $.notify({
                    message: response.data,
                    icon: 'glyphicon glyphicon-warning-sign'
                },{
                    type: 'danger',
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });

                // notify next "then" functions that an error occurred
                return true;
            }

            /**
             * Remove product from comparison and then save count of available products in comparison.
             * @param {Number} productId
             * @returns {Promise}
             */
            function removeProductFromComparison(productId) {
                return ProductComparisonRest.comparison
                    .one('products', productId).remove()
                    .then(getProductIds)
                    .then(function(data) { productsCount = data.length; });
            }

            /**
             * Return products ID's in comparison
             * @returns {Promise}
             */
            function getProductIds() {
                return ProductComparisonRest.comparison.all('products/ids').getList();
            }

            /**
             * Return products in comparison
             * @returns {Promise}
             */
            function getComparison() {
                return ProductComparisonRest.comparison
                    .one('productscomparison').get()
                    .then(function(data) {
                        comparedCategories = data.compared_categories;
                        return data;
                    });
            }

            return {
                getProductsCategories       : function() { return comparedCategories; },
                getProductsCount            : function() { return productsCount; },
                removeProductFromComparison : removeProductFromComparison,
                addProductToComparison      : addProductToComparison,
                getProductIds               : getProductIds,
                getComparison               : getComparison
            };
        }
    ]);