'use strict';

/**
 * Describe the comparison page controller
 */
angular.module('epam.productcomparison')
    .controller('ProductComparisonCtrl',
        ['$scope', '$rootScope', '$q', 'ProductComparisonService', '$stateParams', 'ProductComparisonSorting',
            function ($scope, $rootScope, $q, ProductComparisonService, $stateParams, SortingService) {
                var formedAttrs = null;

                $scope.products = [];
                $scope.isComparisonPage = true;
                $scope.defaultSorting = "a-z";

                // watch for count of products in comparison
                $rootScope.$watch(ProductComparisonService.getProductsCount,
                    function (newVal, oldVal) { if (newVal !== oldVal) { refresh(); }}
                );

                // close all notifications
                $.notifyClose();

                /**
                 * Get products to comparison
                 */
                function refresh() {
                    var selectedCategoryId = $stateParams.catID || 'All';

                    $scope.isSpinner = true;

                    ProductComparisonService.getComparison()
                        .then(function (comparison) {
                            // Hide spinner
                            $scope.isSpinner  = false;
                            $scope.comparison = comparison;
                            $scope.categories = comparison.compared_categories || [];

                            $scope.setSelectedCategory(selectedCategoryId);

                            if ($scope.products.length > 0) {
                                $scope.mixins     = comparison.compared_products[0].compared_mixins || [];
                                $scope.groups     = getGroups($scope.mixins);
                                $scope.attributes = getAttributes($scope.groups);

                                // set attributes weight for each attributes set and its groups
                                calcAttributesWeight();

                                // launch default sorting
                                $scope.switchSorting($scope.defaultSorting);
                            }

                            $scope.hideEqualByDefault = comparison.default_hide_equal_attributes_config === 'true';
                            $scope.hideEmptyByDefault = comparison.default_hide_empty_attributes_config === 'true';
                            $scope.defaultSorting = comparison.default_sorting;
                        });
                }

                // Processing groups of compared attributes

                /**
                 * Return ids of compared attributes groups
                 * @param mixinsInComparison {Array} - compared products mixin
                 * @returns {Array} with ids
                 */
                function getGroupsIDs(mixinsInComparison) {
                    var groupId;

                    return mixinsInComparison.reduce(function(result, mixin) {
                        groupId = mixin.key.match(/^attributegroup_\d*_\d/)[0];

                        if (groupId && result.indexOf(groupId) === -1) { result.push(groupId); }

                        return result;
                    }, []);
                }

                /**
                 * Returns titles of compared attributes groups
                 * @param ids {Array} of compared attributes groups
                 * @returns {Array} with the groups titles
                 */
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

                /**
                 * Concat groups IDs and appropriate titles
                 * @param mixinsInComparison {Array} - compared products mixin
                 * @returns {Array} each compared group id and title
                 */
                function getGroups(mixinsInComparison) {
                    var groupsIDs    = getGroupsIDs(mixinsInComparison);
                    var groupsTitles = getGroupsTitles(groupsIDs);

                    return groupsIDs.map(function(id, index) {
                        return {
                            title: groupsTitles[index],
                            id: id
                        };
                    });
                }

                // Compared attributes processing block

                /**
                 * Return list of attributes ids
                 * @param groups
                 * @returns {Array} of appropriate to attributes group objects with ids
                 */
                function getAttributesIDs(groups) {
                    var mixinsInComparison = $scope.mixins;
                    var currentMixinKey, attributeId;

                    /**
                     * Parse attribute id
                     * @param id {String} Attributes group identifier
                     * @returns {{ids: Array}} List of attributes id in group
                     * @private
                     */
                    function _parseAttrID (id) {
                        var regexExp = '^' + id + '.*';
                        var result = [];

                        mixinsInComparison.forEach(function(mixin) {
                            currentMixinKey = mixin.key;

                            if (!new RegExp(regexExp).test(currentMixinKey)) return;

                            attributeId = currentMixinKey.match(/attribute_\d*_\d/)[0];
                            result.push(attributeId);
                        });

                        return { ids : result };
                    }

                    return groups.map(function(group) { return _parseAttrID(group.id) });
                }

                /**
                 * Return list of appropriate to attributes group titles
                 * @param groups {Array} list of groups
                 * @param attrs {Array} list of attributes ids
                 * @returns {Array} List of attribute titles
                 */
                function getAttributesTitles(groups, attrs) {
                    /**
                     * Return attribute title by attribute id
                     * @param attributeId {Number} attribute id
                     * @param groupId {Number} group id
                     * @returns {string}
                     */
                    function parseTitle(attributeId, groupId) {
                        var title = '';
                        // Get this group child attributes
                        formedAttrs
                            .reduce(function(res, obj) {
                                return obj.id === groupId ? obj.attributes : res;
                            },[])
                            // Find attribute title by Id
                            .forEach(function(obj) {
                                if (obj.id === attributeId) title = obj.title;
                            });

                        return title;
                    }

                    return groups.map(function(group, index) {
                        // Get appropriate titles by each group index
                        return {
                            titles : attrs[index].ids.map(function(id) {
                                return parseTitle(id, group.id);
                            })
                        };
                    });
                }

                /**
                 * Return object with appropriate to each group ids and titles
                 * @param groups List of attributes group
                 * @returns {Object} object key is group id with appropriate group's ids and titles
                 */
                function getAttributes(groups) {
                    var attrIDs    = getAttributesIDs(groups);
                    var attrTitles = getAttributesTitles(groups, attrIDs);

                    /**
                     * Concat attributes id with appropriate titles
                     * @param index {Number} index of attributes group to getting attributes ids and titles
                     * @returns {Array} List of attributes with ids and titles
                     */
                    function combineAttrDetails(index) {
                        return attrIDs[index].ids.map(function(id, i) {
                            return {
                                id    : id,
                                title : attrTitles[index].titles[i]
                            }
                        });
                    }

                    return groups.reduce(function(res, group, index) {
                        // Added attribute details for each group by group id
                        res[group.id] = combineAttrDetails(index);

                        return res;
                    }, []);
                }

                /**
                 * Sort attributes and its groups by alphabet
                 * @param {String} sortParam - asc || desc
                 */
                function alphabetSorting(sortParam) {
                    $scope.groups = SortingService.sortGroups($scope.groups, sortParam);
                    $scope.attributes = SortingService.sortAttributes($scope.attributes, sortParam);
                }

                /**
                 * Sort attributes and its groups by alpfabet
                 * @param {String} sortParam - asc || desc
                 */
                function сommonAttrsSorting(sortParam) {
                    $scope.groups = SortingService.sortCommonGroups($scope.groups, sortParam);
                    $scope.attribute = SortingService.sortCommonAttributes($scope.attributes, sortParam);
                }

                /**
                 * Calculate weight for each attributes set and group
                 */
                function calcAttributesWeight() {
                    var products = $scope.products.slice();
                    var productsLng = products.length;
                    var gID, aID, attributes, attrValue, emptyAttrsCount;

                    $scope.groups.forEach(function(group) {
                        gID             = group.id;
                        attributes      = $scope.attributes[gID];
                        emptyAttrsCount = 0; // count of empty attributes

                        // if group have different attributes
                        group.diffAttrs  = false;
                        group.weight     = 0;

                        attributes.forEach(function(attribute) {
                            aID = attribute.id;
                            attribute.weight = 0;
                            attribute.empty = false;

                            if (products.length === 1) {
                                group.diffAttrs = true;
                                attribute.weight = $scope.getProductAttribute(products[0], aID, gID).match(/-/) ? 1 : 0;
                            }

                            products.length !== 1 && products.forEach(function(product, index) {
                                attrValue = $scope.getProductAttribute(product, aID, gID);

                                // Check that group have different attributes values
                                if (!group.diffAttrs) {
                                    group.diffAttrs = checkForDifferent(attrValue, index, aID, gID);
                                }

                                // Check that the attribute isn't empty
                                attribute.weight += attrValue.match(/-/) ? 1 : 0;
                            });

                            if (attribute.weight === productsLng) {
                                // Mark as empty attribute if all values are empty
                                attribute.empty = true;
                                // calculate count of empty attributes for each group
                                emptyAttrsCount += 1;
                            }

                            // addition of attributes weight in current group
                            group.weight += attribute.weight;
                        });

                        group.weight   /= attributes.length;
                        group.onlyEmpty = (emptyAttrsCount === attributes.length);
                    });
                }

                /**
                 * Try to find out different attributes value in attributes list
                 * @param {String} prevAttrValue - the current attribute's value for comparison
                 * @param {Number} index - need to get rest of unprocessed products
                 * @param {String} attributeID - for attributes titles getting
                 * @param {String} groupID - for attributes titles getting
                 * @returns {boolean} true - if different attributes was found
                 */
                function checkForDifferent(prevAttrValue, index, attributeID, groupID) {
                    var products = $scope.products.slice(index);
                    var result   = false;

                    products.forEach(function(product) {
                        if (!result) {
                            result = ( prevAttrValue !== $scope.getProductAttribute(product, attributeID, groupID) )
                        }
                    });

                    return result;
                }

                /**
                 * Return title of compared product attribute
                 * @param {Object} product - describe compared product
                 * @param {String} attributeId - id of attribute
                 * @param {String} groupId - id of attributes group
                 * @returns {String} - appropriate product's attribute title
                 */
                $scope.getProductAttribute = function (product, attributeId, groupId) {
                    var currentMixin;

                    for (var i = 0; i < product.compared_mixins.length; i++) {
                        currentMixin = product.compared_mixins[i];

                        if (currentMixin.key === groupId + '_' + attributeId) { return currentMixin.value; }
                    }

                    return '';
                };

                /**
                 * Filter products by selected category
                 * @param categoryId {String} - Id of products category
                 */
                $scope.setSelectedCategory = function (categoryId) {
                    var products = $scope.comparison.compared_products || [];

                    $scope.products = products.filter(function(prod) {
                        return prod.direct_category_ids.indexOf(categoryId) !== -1 || categoryId === 'All'
                    });

                    // Recalculate attributes weight and restore sorting after category changes.
                    if ($scope.groups) {
                        calcAttributesWeight();
                        $scope.switchSorting($scope.defaultSorting);
                        $scope.selectedCategory = categoryId;
                    }
                };

                /**
                 * Send request to remove priducts from selected category
                 */
                $scope.removeProducts = function (ev, catID) {
                    var products, promises;

                    if (catID) {
                        products = $scope.comparison.compared_products.filter(function(prod) {
                            return prod.direct_category_ids.indexOf(catID) !== -1;
                        });
                    } else {
                        products = $scope.comparison.compared_products;
                    }

                    // TODO Should have a separate server's controller that removes all products
                    promises = products.map(function(prod) {
                        return ProductComparisonService.removeProductFromComparison(prod.id);
                    });

                    // Show spinner
                    $scope.isSpinner = true;

                    $q.all(promises).then(refresh);

                    ev.stopPropagation();
                };

                /**
                 * Handle sorting strategy selection
                 * @param sortType {String} Params for sorting. Attribute or Group and sorting strategy.
                 */
                $scope.switchSorting = function(sortType) {
                    // sorting by alphabet
                    if (sortType === 'a-z') {
                        alphabetSorting('asc');
                    } else if (sortType == 'z-a') {
                        alphabetSorting('desc');
                    }

                    // sorting by common attributes
                    if (sortType === 'commonTop') {
                        сommonAttrsSorting('asc');
                    } else if (sortType === 'commonDown') {
                        сommonAttrsSorting('desc');
                    }

                    // save current sort type
                    $scope.defaultSorting = sortType;
                };

                refresh();
            }
        ]);

