angular.module('test2App').service('ScheduleService', [ '$http', '$q', function($http, $q) {
	var variables = {
		url : {
			allCompanies : 'http://developerdashboard.previewourapp.com/Company/GetAllCompanies?email=luxliu007168@gmail.com',
			allUsers : 'http://developerdashboard.previewourapp.com/User/GetAllUsers?email=luxliu007168@gmail.com',
			scheduleByUserAndDate : 'http://developerdashboard.previewourapp.com/Schedule/GetScheduleByUserAndDate?email=luxliu007168@gmail.com',
			saveSchedule : 'http://developerdashboard.previewourapp.com/Schedule/SaveSchedule?email=luxliu007168@gmail.com'
		},
		companies : [],
		users : [],
		userIndex : undefined,
		companyIndex : undefined,

		getAllCompanies : function() {
			var defer = $q.defer();

			if (variables.companies.length > 0) {
				defer.resolve(variables.companies);
				return defer.promise;
			}

			$http.get(variables.url.allCompanies).then(function(response) {
				variables.companies = response.data;
				defer.resolve(variables.companies);
			}, function(response) {
				defer.reject(response);
			});

			return defer.promise;
		},
		getAllUsers : function() {
			var defer = $q.defer();

			if (variables.users.length > 0) {
				defer.resolve(variables.users);
				return defer.promise;
			}

			$http.get(variables.url.allUsers).then(function(response) {
				variables.users = response.data;
				defer.resolve(variables.users);
			}, function(response) {
				defer.reject(response);
			});
			return defer.promise;
		}
	};
	
	
	
	variables.getAllCompanies();
	variables.getAllUsers();
	
	
	return {
		getAllCompanies : function() {
			return variables.getAllCompanies();
		},
		getAllUsers : function() {
			return variables.getAllUsers();
		},
		getScheduleByUserAndDate : function(userId, date) {
			var defer = $q.defer();
			$http.get(variables.url.scheduleByUserAndDate + '&userId=' + userId + '&date=' + date).then(function(response) {
				defer.resolve(response);
			}, function(response) {
				defer.reject(response);
			});
			return defer.promise;
		},
		saveSchedule : function(obj) {
			var defer = $q.defer();
			$http.post(variables.url.saveSchedule, obj).then(function(response) {
				defer.resolve(response);
			}, function(response) {
				defer.reject(response);
			});
			return defer.promise;
		},
		findCompanyById : function(id) {
			if (variables.companyIndex == undefined) {
				this.__indexCompany();
			}
			return variables.companyIndex[id];
		},
		__indexCompany : function() {
			var index = {};
			variables.companies.forEach(function(company) {
				index[company.Id] = company;
			});
			variables.companyIndex = index;
		},
		findUserById : function(userId) {
			if (variables.userIndex == undefined) {
				this.__indexUser();
			}
			return variables.userIndex[userId];
		},
		__indexUser : function() {
			var index = {};
			variables.users.forEach(function(user) {
				index[user.Id] = user;
			});
			variables.userIndex = index;
		}
	};
} ])