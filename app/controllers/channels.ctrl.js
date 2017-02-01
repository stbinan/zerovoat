app.controller('ChannelsCtrl', ['$scope','$location','$window','$rootScope',
	function($scope,$location,$window,$rootScope) {

		// get channel
		$scope.getChannel = function() {
			$scope.loading = false;
			var channel_id = $location.$$absUrl.split('channel_id=')[1].split('&')[0];
			var query = ["SELECT * FROM channel WHERE channel_id='"+channel_id+"'"];
			Page.cmd("dbQuery", query, function(channel) {
				$scope.channel = channel[0];
				$rootScope.$broadcast('setChannel',$scope.channel);
				$scope.loading = false;
				$scope.$apply();
			});				
		};

		// create channel
		$scope.createChannel = function(channel){
			// inner path to user's data.json file
			var inner_path = 'data/users/' + $scope.page.site_info.auth_address + '/data.json';
			// get data.json
			Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
				// render data
				if (data){ 
					data = JSON.parse(data);
					if (!data.channel){
						data.channel = [];
						data.next_channel_id = 1;
					}
				} else { 
					data = { 
						next_channel_id:1, 
						channel:[] 
					}; 
				}

				// new category entry
				channel.channel_id = $scope.page.site_info.auth_address + data.next_channel_id.toString();
				channel.added = +(new Date);
				// user id
				if ($scope.page.site_info.cert_user_id){ channel.user_id = $scope.page.site_info.cert_user_id; } 
				else { channel.user_id = $scope.page.site_info.auth_address; }				
				// add category to user's categorys
				data.channel.push(channel);
				// update next category id #
				data.next_channel_id += 1;
				console.log(channel);
				// write to file
				var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
				Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
					console.log(res);
					// sign & publish site
					Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
						console.log(res);
						// apply to scope
						$scope.$apply(function() {
							Page.cmd("wrapperNotification", ["done", "Channel Created!", 10000]);
							$window.location.href = '/'+ $scope.page.site_info.address +'/?channel_id='+channel.channel_id;
						});
					});
				});
			});
		};

		// update channel
		$scope.updateChannel = function(channel){
			// inner path to user's data.json file
			var inner_path = 'data/users/' + $scope.page.site_info.auth_address + '/data.json';
			// get data.json
			Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
				data = JSON.parse(data);
				// get channel's index
				var chanIndex;
				data.channel.forEach(function(ch,index){
					if (ch.channel_id === channel.channel_id){
						chanIndex = index;
					}
				});	
				// remove & re-add channel to user's channels
				data.channel.splice(chanIndex,1);
				data.channel.push(channel);
				// write to file
				var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
				Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
					console.log(res);
					// sign & publish site
					Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
						console.log(res);
						// apply to scope
						$scope.$apply(function() {
							Page.cmd("wrapperNotification", ["done", "Channel Updated!", 10000]);
							$window.location.href = '/'+ $scope.page.site_info.address +'/?channel_id='+channel.channel_id;
						});
					});
				});
			});
		};

		// add channel moderator 
		$scope.addChannelModerator = function(moderator){
			// inner path to user's data.json file
			var inner_path = 'data/users/' + $scope.page.site_info.auth_address + '/data.json';
			// get data.json
			Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
				var isChannelMod = false;
				// render data
				if (data){ 
					data = JSON.parse(data);
					if (!data.moderator){
						data.moderator = [];
						data.next_moderator_id = 1;
					} else {
						data.moderator.forEach(function(mod,index){
							if (mod.user_name === $scope.page.site_info.cert_user_id){
								isChannelMod = true;
								Page.cmd("wrapperNotification", ["info", "User is already a moderator for this channel!", 10000]);								
							}
						});
					}
				} else { 
					data = { 
						next_moderator_id:1, 
						moderator:[] 
					}; 
				}
				// if user is not already a channel moderator
				if (isChannelMod === false){
					// moderator obj
					moderator = {
						moderator_id:$scope.page.site_info.auth_address + data.next_moderator_id.toString(),
						user_name:moderator,
						channel_id:$scope.channel.channel_id,
						added:+(new Date)
					};
					// add moderator to user's moderators
					data.moderator.push(moderator);
					// update next moderator id #
					data.next_moderator_id += 1;
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						console.log(res);
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							console.log(res);
							// apply to scope
							Page.cmd("wrapperNotification", ["done", "Moderator Added!", 10000]);
							$scope.$apply();
						});
					});
				}
			});
		};

		// get sector
		$scope.getSector = function() {
			$scope.loading = false;
			var sector_id = $location.$$absUrl.split('sector_id=')[1].split('&')[0];
			var query = ["SELECT * FROM sector WHERE sector_id='"+sector_id+"'"];
			Page.cmd("dbQuery", query, function(sector) {
				console.log(sector);
				$scope.sector = sector[0];
				$rootScope.$broadcast('setSector',$scope.sector);
				$scope.loading = false;
				$scope.$apply();
			});				
		};

		// create sector
		$scope.createSector = function(sector){
			// inner path to user's data.json file
			var inner_path = 'data/users/' + $scope.page.site_info.auth_address + '/data.json';
			// get data.json
			Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
				// render data
				if (data){ 
					data = JSON.parse(data);
					if (!data.sector){
						data.sector = [];
						data.next_sector_id = 1;
					}
				} else { 
					data = { 
						next_sector_id:1, 
						sector:[] 
					}; 
				}

				// new category entry
				sector.sector_id = $scope.page.site_info.auth_address + data.next_channel_id.toString();
				sector.added = +(new Date);
				// user id
				if ($scope.page.site_info.cert_user_id){ sector.user_id = $scope.page.site_info.cert_user_id; } 
				else { sector.user_id = $scope.page.site_info.auth_address; }				
				// add category to user's categorys
				data.sector.push(sector);
				// update next category id #
				data.next_sector_id += 1;
				// write to file
				var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
				Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
					console.log(res);
					// sign & publish site
					Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
						console.log(res);
						// apply to scope
						$scope.$apply(function() {
							Page.cmd("wrapperNotification", ["done", "sector Created!", 10000]);
							$window.location.href = '/'+ $scope.page.site_info.address +'/?sector_id='+sector.sector_id;
						});
					});
				});
			});
		};
	}
]);