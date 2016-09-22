angular.module('starter').factory('Utils', function($ionicLoading,$ionicPopup) {
	//Declare loading message and error message
	var Utils = {
	//show loading image when function trigger
    show: function() {
      $ionicLoading.show({
  	    animation: 'fade-in',
  	    showBackdrop: false,
  	    maxWidth: 200,
  	    showDelay: 500,
        template: '<p class="item-icon-left">Loading<ion-spinner icon="lines"/></p>'
      });
    },
    //hide loading
    hide: function(){
      $ionicLoading.hide();
    },
    //show alert message
	alertshow: function(tit,msg){
		var alertPopup = $ionicPopup.alert({
			title: tit,
			template: msg
		});
	},
	//show all error message for login and sign up
	errMessage: function(err) {
	    var msg = "Unknown Error...";
	    if(err && err.code) {
	      switch (err.code) {
	        case "EMAIL_TAKEN":
	          msg = "This Email has been taken."; break;
	        case "INVALID_EMAIL":
	          msg = "Invalid Email."; break;
          case "NETWORK_ERROR":
	          msg = "Network Error."; break;
	        case "INVALID_PASSWORD":
	          msg = "Invalid Password."; break;
	        case "INVALID_USER":
	          msg = "Invalid User."; break;
	      }
	    }
			Utils.alertshow("Error",msg);
	},
  };
	return Utils;

});
