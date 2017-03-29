/* global google: true*/
angular
  .module('dateApp')
  .directive('restaurantMap', restaurantMap);

restaurantMap.$inject = ['$window'];
function restaurantMap($window) {
  const directive = {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map"></div>',
    scope: {
      center: '=',
      restaurants: '=',
      user: '='
    },
    link($scope, element) {
      // console.log('scope', $scope.restaurants);
      // console.log('user scope', $scope.user.geometry.lat);

      let infoWindow = null;
      const radius = 2000;
      let marker = null;

      const cinemaLatLng = { lat: 51.544235, lng: -0.051672 };
      const markers = [];

      // const userLat = ;
      const map = new $window.google.maps.Map(element[0], {
        zoom: 13,
        center: cinemaLatLng,
        scrollwheel: false
      });
      const circle = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        fillColor: '#0000FF',
        fillOpacity: 0.2,
        map: map,
        center: cinemaLatLng,
        radius: radius
      });

      $scope.restaurants.forEach(function(restaurant){
        // console.log('restaurant', restaurant);
        restaurant.latitude = restaurant.geometry.location.lat;
        restaurant.longitude = restaurant.geometry.location.lng;

        addMarker(restaurant);
      });

      function addMarker(restaurant) {
        const latLng = { lat: restaurant.latitude, lng: restaurant.longitude };
        // console.log(latLng);
        marker = new google.maps.Marker({
          position: latLng,
          map,
          animation: google.maps.Animation.DROP
          // icon: '/assets/restaurant.svg' // Adding a custom icon
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function () {
          if(infoWindow) infoWindow.close();
          var infoWindowOptions = {
            content: `<div><p>${restaurant.name}<br>${restaurant.vicinity}</p></div>`
          };
          infoWindow = new google.maps.InfoWindow(infoWindowOptions);
          infoWindow.open(map, marker);
        });
      }
    }
  };

  return directive;
}
