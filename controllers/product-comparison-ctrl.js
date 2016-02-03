'use strict';

angular.module('epam.productcomparison')
    .controller('ProductComparisonCtrl', ['$scope', '$rootScope', '$q', 'ProductComparisonService',
        function ($scope, $rootScope, $q, ProductComparisonService) {
            var formedAttrs = null;

            $scope.isComparisonPage = true;

            // close all notifications
            $.notifyClose();

            function refresh() {
                $scope.selectedCategoryId = 'All';
                // Show spinner
                $scope.showSpinner = true;

                ProductComparisonService.getComparison()
                    .then(function (comparison) {
                        // Hide spinner
                        $scope.showSpinner = false;

                        $scope.comparison = comparison;
                        $scope.products = comparison.compared_products || [];
                        $scope.categories = comparison.compared_categories || [];

                        if ($scope.products.length > 0) {
                            $scope.mixins = comparison.compared_products[0].compared_mixins || [];
                            $scope.groups = $scope.getGroups($scope.mixins);
                        }
                    });
            }

            function getGroupsIDs(mixinsInComparison) {
                var groupId;

                return mixinsInComparison.reduce(function(result, mixin) {
                    groupId = mixin['key'].match(/^attributegroup_\d*_\d/)[0];

                    if (groupId && result.indexOf(groupId) === -1) { result.push(groupId); }

                    return result;
                }, []);
            }

            function getGroupsTitles(ids) {
                var attrs = $scope.comparison.category_attributes,
                    formed = [], key, titles;

                // Form attributes
                for (key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        formed = formed.concat(attrs[key]);
                    }
                }

                titles = ids.map(function(id) {
                    var title;

                    formed.forEach(function(attr) {
                        if (attr.id === id) { title = attr.title; }
                    });

                    if (title) { return title; }
                });

                formedAttrs = formed;

                return titles;
            }

            refresh();

            $rootScope.$on('REMOVED_TO_COMPARISON', refresh);

            $scope.getProductMixinValue = function (product, mixinKey) {
                var mixins = product.compared_mixins;
                for (var i = 0; i < mixins.length; i++) {
                    if (mixins[i].key === mixinKey) {
                        return mixins[i].value;
                    }
                }
            };

            $scope.setSelectedCategory = function (categoryId) {
                var products = $scope.comparison.compared_products,
                    filteredProducts = [];

                for (var i = 0; i < products.length; i++) {
                    if (products[i].direct_category_ids.indexOf(categoryId) !== -1 || categoryId === 'All') {
                        filteredProducts.push(products[i]);
                    }
                }

                $scope.products = filteredProducts;
                $scope.selectedCategoryId = categoryId;
            };

            $scope.getGroups = function (mixinsInComparison) {
                var groupsIDs = getGroupsIDs(mixinsInComparison);
                var groupsTitiles = getGroupsTitles(groupsIDs);

                return groupsIDs.map(function(id, index) {
                    return {
                        title: groupsTitiles[index],
                        id: id
                    };
                });
            };

            $scope.getAttributes = function (groupId) {
                var attributesIds = [],
                    mixinsInComparison = $scope.mixins;

                for (var i = 0; i < mixinsInComparison.length; i++) {
                    var currentMixinKey = mixinsInComparison[i].key;
                    var regexExp = '^' + groupId + '.*';

                    if (new RegExp(regexExp).test(currentMixinKey)) {
                        var attributeId = currentMixinKey.match(/attribute_\d*_\d/)[0];

                        if (attributesIds.indexOf(attributeId) === -1) {
                            attributesIds.push(attributeId);
                        }
                    }
                }

                return attributesIds;
            };

            $scope.getAttributeTitle = function(attributeId, groupId) {
                var title = '';
                // Get this group child attributes
                formedAttrs
                    .reduce(function(res, obj) {
                        return obj.id === groupId ? obj.attributes : res;
                    },[])
                    // Find attribute title by Id
                    .forEach(function(obj) {
                       if (obj.id === attributeId) {
                           title = obj.title;
                       }
                    });

                return title;
            };

            $scope.getProductAttribute = function (product, attributeId, groupId) {
                var currentMixin;

                for (var i = 0; i < product.compared_mixins.length; i++) {
                    currentMixin = product.compared_mixins[i];

                    if (currentMixin.key === groupId + '_' + attributeId) {
                        return currentMixin.value;
                    }
                }

                return '';
            };

            $scope.removeAll = function () {
                var promises = [];
                // Show spinner
                $scope.showSpinner = true;

                $scope.products.forEach(function(prod) {
                    promises.push(ProductComparisonService.removeProductFromComparison(prod.id));
                });

                $q.all(promises).then(function() { $rootScope.$broadcast('REMOVED_TO_COMPARISON'); });
            };
        }
    ]);

