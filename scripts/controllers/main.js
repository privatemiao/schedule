angular.module('test2App').controller('DashboardController', function($scope, ScheduleService, $filter) {
	$scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
	$scope.users = [];

	var service = {
		loadUsersTasks : function() {
			ScheduleService.getAllUsers().then(function(response) {
				$scope.users = response;
				response.forEach(function(user) {
					service.loadUserTasks(user);
				});
			}, function(response) {
				console.log('Error', response);
			});
		},
		loadUserTasks : function(user) {
			ScheduleService.getScheduleByUserAndDate(user.Id, $scope.date).then(function(response) {
				user.tasks = response.data.Tasks;
				user.tasks.forEach(function(task){
					task.company = ScheduleService.findCompanyById(task.CompanyId);
				});
			}, function(response) {
				console.log('Error', response);
			});
		},
		setDate : function(){
			var date = window.prompt();
			if (date == undefined){
				return;
			}
			var d = new Date(date);
			if (d == 'Invalid Date'){
				alert(d);
				return;
			}
			
			$scope.date = date;
			$scope.users = [];
			service.loadUsersTasks();
		}
	};

	service.loadUsersTasks();
	
	this.setDate = service.setDate;

}).controller('PersonController', function($scope, $routeParams, ScheduleService, $filter) {
	$scope.date = $routeParams.date ? $routeParams.date : $filter('date')(new Date(), 'yyyy-MM-dd');
	$scope.user = $routeParams.userId ? ScheduleService.findUserById($routeParams.userId) : ScheduleService.findUserById(1);
	$scope.tasks = [];
	$scope.companies = [];
	$scope.status = [ 'Assigned', 'Processing', 'Complete' ];

	var service = {
		loadTasks : function() {
			ScheduleService.getScheduleByUserAndDate($scope.user.Id, $scope.date).then(function(response) {
				$scope.tasks = response.data.Tasks;
				$scope.tasks.forEach(function(task) {
					task.company = ScheduleService.findCompanyById(task.CompanyId);
				});
				console.log('TASK', $scope.tasks);
			}, function(response) {
				console.log('Error', response);
			});
		},
		loadCompanies : function() {
			ScheduleService.getAllCompanies().then(function(response) {
				$scope.companies = response;
			}, function(response) {
				console.log('Error', response);
			});
		},
		move : function(index, step) {
			// top one can move up
			if (index == 0 && step < 0) {
				return;
			}
			// last one can move down
			if (index == $scope.tasks.length - 1 && step > 0) {
				return;
			}

			var tmp = $scope.tasks[index + step];
			$scope.tasks[index + step] = $scope.tasks[index];
			$scope.tasks[index] = tmp;
		},
		save : function() {
			tasks = angular.copy($scope.tasks);
			tasks.forEach(function(t) {
				delete t.company
			});

			var data = {
				UserId : $scope.user.Id,
				Date : $scope.date,
				Tasks : tasks
			};

			ScheduleService.saveSchedule(data).then(function(response) {
				alert(response.data.Message);
			}, function(response) {
				console.log(response);
			});
		},
		newTask : function(index) {
			var blankTask = {
				CompanyId : undefined,
				Description : '',
				Status : undefined,
				Billable : false,
				Meta : undefined,
				company : {}
			};

			if (index == undefined || index == 0) {
				$scope.tasks.unshift(blankTask);
			} else {
				$scope.tasks.splice(index, 0, blankTask);
			}
		},
		deleteTask : function(index) {
			$scope.tasks.splice(index, 1);
		},
		changeCompany : function(index) {
			$scope.tasks[index].CompanyId = $scope.tasks[index].company.Id;
		},
		setDate : function(){
			var date = window.prompt();
			if (date == undefined){
				return;
			}
			var d = new Date(date);
			if (d == 'Invalid Date'){
				alert(d);
				return;
			}
			
			$scope.date = date;
			$scope.tasks = [];
			service.loadTasks();
		}
	};

	service.loadTasks();
	service.loadCompanies();

	this.changeCompany = service.changeCompany;
	this.save = service.save;
	this.move = service.move;
	this.newTask = service.newTask;
	this.deleteTask = service.deleteTask;
	this.setDate = service.setDate;
});