'use strict';

angular.module('epam.productcomparison')
    .directive('showAllAttrsBtn', ['$timeout', function ($timeout) {
        return {
            restrict   : 'EA',
            scope      : {
                hideByDefault: '=',
                selectedCat: '&'
            },
            template   : '<div class="switch-equal-wrap">\n    <span class="title">Hide equal</span>\n    <input id="switch-equal" type="checkbox" name="my-checkbox"/>\n</div>\n',
            link : function (scope) {
                var switcher = $("#switch-equal");
                var isActive = false;

                function openCollapsed () {
                    $('.group-title').removeClass('collapsed');
                    $('.attr-group').addClass('in');
                }

                function openDifferent () {
                    $('.group-title').addClass('collapsed');
                    $('.attr-group').removeClass('in').addClass('collapse');

                    // collapse groups with different attributes
                    $('.diff-attr-group').removeClass('collapsed');
                    $('.different-attr').addClass('collapse').addClass('in');
                }

                function init() {
                    switcher.bootstrapSwitch();

                    if (scope.hideByDefault) {
                        openDifferent();
                        isActive = true;
                        switcher.bootstrapSwitch('state', true, true);
                    } else {
                        switcher.bootstrapSwitch('state', false, true);
                    }
                }

                switcher.on('switchChange.bootstrapSwitch', function(event, switchOn) {
                    switchOn ? openDifferent() : openCollapsed();
                    isActive = !isActive;
                });

                $timeout(init);

                scope.$watch(scope.selectedCat, function(newVal, oldVal) {
                    newVal !== oldVal && isActive && $timeout(openDifferent);
                });
            }
        };
    }]);