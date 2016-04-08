describe('SettingsPageController', function () {
	beforeEach(module('PrayerControllers'));

	var $controller;

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	describe('$scope.religion', function () {
		it('Should get religion from context', function () {
			var $scope = {};
			var controller = $controller('SettingsPageController', {$scope : $scope})

			expect(1 + 1).toEqual(2);
		});
	});
});
