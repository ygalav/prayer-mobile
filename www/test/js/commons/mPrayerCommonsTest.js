describe('mPrayerCommons.js', function () {
	beforeEach(module('PrayerCommons'));

	var context;

	beforeEach(inject(function (_context_) {
		context = _context_;
	}));

	describe('context.setValue', function () {
		it('Should should set value', function () {
			context.systemproperties.setValue(context.systemproperties.keys.language, 'testLanguage');
			expect(window.localStorage[context.systemproperties.keys.language]).toEqual('testLanguage');
			localStorage.removeItem(context.systemproperties.keys.language);
		});
	});
});
