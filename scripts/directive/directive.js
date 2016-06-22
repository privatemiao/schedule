angular.module('test2App').directive('companySelector', function() {
	return {
		restrict : 'E',
		replace : true,
		scope : {
			ngModel : '=',
			ngChange : '&'
		},
		template : '',
		controller : function($scope, ScheduleService) {

		},
		link : function($scope, element, attrs) {

		}
	}
});