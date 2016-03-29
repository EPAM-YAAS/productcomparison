'use strict';

angular.module('epam.productcomparison')
    .directive('switchAttrsGroups', ['$timeout', function ($timeout) {
        return {
            restrict   : 'EA',
            scope      : {
                hideByDefault: '=',
                selectedCat: '&'
            },
            template   : '<div class="switch-empty-wrap">\n    <span class="title">Hide empty</span>\n    <input id="switch-empty" type="checkbox" name="my-checkbox">    \n</div>\n',
            link : function (scope) {
                var switcher = $("#switch-empty");
                var isActive = false;

                function hide () {
                    $('.comparison-group').removeClass('hidden');
                    $('.attr-group').removeClass('hidden');
                    $('.empty-group').addClass('hidden');
                    $('.empty-attrs').addClass('hidden');
                }

                function show () {
                    $('.empty-group').removeClass('hidden');
                    $('.empty-attrs').removeClass('hidden');
                }

                function init() {
                    switcher.bootstrapSwitch();

                    if (scope.hideByDefault) {
                        hide();
                        isActive = true;
                        switcher.bootstrapSwitch('state', true, true);
                    } else {
                        switcher.bootstrapSwitch('state', false, true);
                    }
                }

                $timeout(init);

                switcher.on('switchChange.bootstrapSwitch', function(event, switchOn) {
                    switchOn ? hide() : show();
                    isActive = !isActive;
                });

                scope.$watch(scope.selectedCat, function(newVal, oldVal) {
                   newVal !== oldVal && isActive && $timeout(hide);
                });
            }
        };
    }]);