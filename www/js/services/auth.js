angular.module('starter').factory('Auth', function(FURL, $firebaseAuth, $firebaseArray, $firebaseObject, Utils) {
  //Declare all variable 
	var ref = new Firebase(FURL);
	var auth = $firebaseAuth(ref);

	var Auth = {
		user: {},
    //Function to create a user profile information 
    createProfile: function(uid, user) {
      var profile = {                                         //Basic profile information
				id: uid,
        username:user.username,
        email: user.email,
        address:user.address,
				registered_in: Date()
      };
      var profileRef = $firebaseArray(ref.child('profile'));    //Get firebase profile child
      return profileRef.$add(profile).then(function(ref) {
			  var id = ref.key();
			  profileRef.$indexFor(id);                              // returns location in the array
			});
    },
    //Function to check user input with the login data in firebase 
    login: function(user) {
      return auth.$authWithPassword(
        {email: user.email, password: user.password}
      );
    },
    //Function to register an account 
    register: function(user) {
      return auth.$createUser({email: user.email, password: user.password})
        .then(function() {
          // authenticate so we have permission to write to Firebase
          return Auth.login(user);
        })
        .then(function(data) {
          // store user data in Firebase after creating account
          return Auth.createProfile(data.uid, user);
        });
    },
    //Function to logout. unauth all the data from firebase
    logout: function() {
      auth.$unauth();
    },
    //An 24 hour token password will send to your email
		resetpassword: function(user) {
			return auth.$resetPassword({
				  email: user.email
				}).then(function() {
					Utils.alertshow("Password reset email sent successfully!");    
				}).catch(function(error) {
					Utils.errMessage(error);
				});
    },
    //Function to change password
		changePassword: function(user) {
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},
    //Check whether user is signedIn or not
    signedIn: function() {
      return !!Auth.user.provider; //using !! means (0, undefined, null, etc) = false | otherwise = true
    }
	};
  //let the user keep signedIn although quit from the app
	auth.$onAuth(function(authData) {
		if(authData) {
      angular.copy(authData, Auth.user);
      Auth.user.profile = $firebaseObject(ref.child('profile').child(authData.uid));
		} else {
      if(Auth.user && Auth.user.profile) {
        Auth.user.profile.$destroy();
      }
      angular.copy({}, Auth.user);
		}
	});
    return Auth;
  })
