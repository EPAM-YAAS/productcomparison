'use strict';

angular.module('epam.productcomparison')
	.factory('ProductComparisonService', ['ProductComparisonRest',
		function(ProductComparisonRest) {

			return {
				addProductToComparison : function(productId) {
					return ProductComparisonRest.comparison.one(
							'products', productId).post();
				},
				removeProductFromComparison : function(productId) {
					return ProductComparisonRest.comparison.one(
							'products', productId).remove();
				},
				getProductIds : function() {
					return ProductComparisonRest.comparison.all(
							'products/ids').getList();
				},
				getComparison : function() {
					return ProductComparisonRest.comparison.one('productscomparison').get();
				}
			};
		}
	]);