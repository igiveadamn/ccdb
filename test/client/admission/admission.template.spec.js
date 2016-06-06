describe('build the basic page', function () {

    beforeEach(module('ices.patient'));
    beforeEach(module('ices.history.directive'));
    beforeEach(module('ices.score.directive'));
    beforeEach(module('ices.templates'));

    var element, $scope, compile;
    //var isolateScope = element.isolateScope(); // this scope is an instance of Scope (for directives, etc.)
    var html;

    beforeEach(inject(function($rootScope, $compile, $templateCache) {
        html = $templateCache.get('admission/admission.html');
        scope = $rootScope.$new();
        compile = $compile;
    }));

    //it ('should have the admission outcome', function () {
    //    scope.patient = { admission: { outcome: 'admitted' } };
    //
    //    element = angular.element(html);
    //    compile(element)(scope);
    //    scope.$digest();
    //
    //    var doc = element.first();
    //
    //    expect(doc.find('#outcome').text()).toEqual('admitted');
    //
    //});


});
