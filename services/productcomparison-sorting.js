'use strict';

angular.module('epam.productcomparison')
    .factory('ProductComparisonSorting', [function() {

        /**
         * Apply sorting strategy to attributes group list
         * @param data {Array} List of attributes groups to sorting
         * @param param {String} Sorting param
         * @returns {Array} sorted groups list
         */
        function sortGroups(data, param) {
            if (param === 'asc')  return data.sort(_ascending);
            if (param === 'desc') return data.sort(_descending);
        }

        /**
         * Apply sorting strategy to attributes in each attributes group
         * @param data {Object} List or attributes for each group
         * @param param {String} Sorting param
         * @returns {Object} list of sorted attributes for each group
         */
        function sortAttributes(data, param) {
            var strategy  = null;

            // Get sorting strategy for attributes
            if (param === 'asc')  strategy = _ascending;
            if (param === 'desc') strategy = _descending;

            // Iterate over each group attributes and sort it
            for (var attrGroup in data) {
                if (data.hasOwnProperty(attrGroup)) data[attrGroup] = data[attrGroup].sort(strategy);
            }

            return data;
        }

        function sortCommonAttributes(data, param) {
            var strategy  = null;

            // Get sorting strategy for attributes
            if (param === 'asc')  strategy = _commonToTop;
            if (param === 'desc') strategy = _commonToDown;

            for (var attrGroup in data) {
                if (data.hasOwnProperty(attrGroup)) data[attrGroup] = data[attrGroup].sort(strategy);
            }

            return data;
        }

        function sortCommonGroups(data, param) {
            var strategy  = null;

            // Get sorting strategy for attributes
            if (param === 'asc')  strategy = _commonToTop;
            if (param === 'desc') strategy = _commonToDown;

            return data.sort(strategy);
        }

        // Sorting strategies

        function _ascending(a, b) { return a.title > b.title ? 1 : -1; }

        function _descending(a, b) { return a.title < b.title ? 1 : -1; }

        function _commonToTop(a, b) { return a.weight > b.weight ? 1 : -1; }

        function _commonToDown(a, b) { return a.weight < b.weight ? 1 : -1; }

        return {
            sortGroups     : sortGroups,
            sortCommonGroups : sortCommonGroups,
            sortCommonAttributes : sortCommonAttributes,
            sortAttributes : sortAttributes
        };
    }]);