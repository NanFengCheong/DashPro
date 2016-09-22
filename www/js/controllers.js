/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $ionicHistory,Auth,$localStorage,$location) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    $scope.username = $localStorage.username;
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
      $scope.logOut = function () {
    Auth.logout();
    $localStorage.$reset();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
     });
       $location.path("/login");
    }  
})

.controller('LoginCtrl', function($scope, $state, $timeout, $stateParams, ionicMaterialInk,$ionicPopup,$firebaseObject, Auth, FURL, Utils,$ionicHistory, $localStorage, $location) {

  var userkey = "";
  var ref = new Firebase(FURL);
  //trigger sign in function from button and send data to services code
  $scope.signIn = function (user) {
    console.log(user.email);
    //diasble user to back to login page after signed in
    $ionicHistory.nextViewOptions({
    disableAnimate: true,
    disableBack: true
    });
    Utils.show();
    Auth.login(user)
      .then(function(authData) {
         Utils.hide();
          $state.go('app.home');
      //if success login, get profile infor and save to local storage
      ref.child('users').on("child_added", function(snapshot) {
        userkey = snapshot.key();
        var obj = $firebaseObject(ref.child('users').child(userkey));
        obj.$loaded()
          .then(function(data) {
            $localStorage.username = obj.name;
            $localStorage.email = obj.email;
            $localStorage.userkey = obj.$id;
            $localStorage.address = obj.phone;
            $localStorage.plate = obj.plate;
            $localStorage.color = obj.color;
            $localStorage.make = obj.make;
            $localStorage.model = obj.model;
            $localStorage.credit = obj.credit;
            Utils.hide();
          
          })
          .catch(function(error) {
            console.error("Error:", error);
          });
      });
      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
  };
})
.controller('HomeCtrl', function($scope,FURL, $ionicPopup, $stateParams, $timeout, $firebaseArray, $cordovaFileTransfer, $location, $cordovaCapture) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.item= [];
    var ref = new Firebase(FURL);
 //var fb = new Firebase("https://dashpro.firebaseio.com/videos");
 //$scope.videos = $firebaseArray(fb);
$scope.record = function(){ 
  var options = { limit: 1, duration: 15 };
  $cordovaCapture.captureVideo(options).then(
      function(videoData) {
          var i, path, len;
          var pathtogo;
          var pathtogostring;
          for (i = 0, len = videoData.length; i < len; i += 1) {
              path = videoData[i].fullPath;
              pathtogo = path.toString();
                pathtogostring = pathtogo.substr(6);  
                 
               /*var obj = {
                    videoP: path,
                    videosrc: pathtogostring
              }

             var postsRef = ref.child("videos");              //create a child node for firebase
                var newPostRef = postsRef.push();
                newPostRef.set({
                     videoP: path,
                    videosrc: pathtogostring
      
                });
                */
                var check = {
                    fileKey: "avatar",
                    fileName: "filename.mp4",
                    chunkedMode: false,
                    mimeType: "video/mp4",
                     headers: {
                            "Content-Type": "multipart/form-data"
                        }

                };
                 alert("Path of the video is = " + path.toString()); 
                $cordovaFileTransfer.upload("http://nanfengazure.cloudapp.net:4000/uploads", path, check).then(function(result) {
                    alert("SUCCESS: " + JSON.stringify(result.response));
                }, function(err) {
                     alert("SERR: " + JSON.stringify(err));
                }, function (progress) {
                    // constant progress updates
                });

            }
      },
      function(err) {
            }
  );
}//end record

})
.controller('DetailCtrl', function($scope, $ionicPopup,$state, $stateParams,FURL, $timeout,$localStorage, Utils,ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
 var ref = new Firebase(FURL);



    $scope.data={};
    Utils.show();
      ref.child('reports').orderByChild("bookmark-id").equalTo($localStorage.bookmarksId).on("value", function(snapshot) {
        $scope.data = snapshot.val();
        Utils.hide();
      });
           $scope.submit= function(){
                var alertPopup = $ionicPopup.alert({
                 title: 'Report submited successfully!',
                 });
                 alertPopup.then(function(res) {
                      $state.go("app.home");
                   });
              
           }
})


.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

})

.controller('ProfileCtrl', function($scope, $localStorage,$stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk,$ionicPopup) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

         $scope.username= $localStorage.username 
           $scope.email=  $localStorage.email
          $scope.address=   $localStorage.address
          $scope.plate=   $localStorage.plate
          $scope.color=   $localStorage.color
         $scope.make=   $localStorage.make
          $scope.model=   $localStorage.model
           $scope.credit=  $localStorage.credit
           $scope.score= $localStorage.score

           $scope.checkout= function(){
                var alertPopup = $ionicPopup.alert({
                 title: 'Balances are checked out successfully!',
                 });
           }

})

.controller('ActivityCtrl', function($scope, Utils, FURL, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
    $scope.data=[]
        var ref = new Firebase(FURL);
     Utils.show();

      ref.child('activities').once("value", function(snapshot) {
         snapshot.forEach(function(item) {
             var itemVal = item.val();
             $scope.data.push({
                    status : itemVal.status,
                    id :item.key(),
                    timestamp: itemVal.timestamp,
              });  
        });
        Utils.hide();
      });

})

.controller('GalleryCtrl', function($scope, $state, $stateParams, $timeout, FURL, $localStorage,ionicMaterialInk, ionicMaterialMotion,Utils) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);
    $scope.data = [];
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
    Utils.show();
    var ref = new Firebase(FURL);
      ref.child('bookmarks').once("value", function(snapshot) {
         snapshot.forEach(function(item) {
             var itemVal = item.val();
             $scope.data.push({
                    latitude :itemVal.latitude,
                    longitude :itemVal.longitude,
                    status : itemVal.status,
                    id :item.key(),
                    timestamp: itemVal.timestamp,
                    img: itemVal.img
              });  
        });
        Utils.hide();
      });
      $scope.specificItem= function(id){
        $localStorage.bookmarksId = id;
        $state.go("app.detail");
      }
})

;
