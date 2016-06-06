describe('multi select', function () {

    beforeEach(module('ices.utils.form'));
    beforeEach(module('ices.templates'));

    var html, scope, compile, element, directiveScope, doc;

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
    }));

    var compileTemplate = function (html) {
        html = '<ices-form-multiselect label="make a choice" options="choices" value="selected" other="true"></ices-form-multiselect>';
        element = compile(angular.element(html))(scope);
        directiveScope = element.isolateScope();
        doc = element[0];
        scope.$digest();
    };

    it ('should have the label', function () {
        compileTemplate();

        expect(element.find('label').text()).toEqual('make a choice');
    });

    it('should have one checkbox for one element', function () {
        scope.choices = ['option 1'];
        compileTemplate();

        expect(element.find('.right').length).toEqual(1);

    });


});
