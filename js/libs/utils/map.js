window.initialize_map = function(obj)  {
  // Creating a LatLng object containing the coordinate for the center of the map
  var latlng = new google.maps.LatLng(obj[0]["lat"], obj[0]["long"]);
  // Creating an object literal containing the properties we want to pass to the map
  var options = {
    zoom: 11,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }; 
  // Calling the constructor, thereby initializing the map
  
  var map = new google.maps.Map(document.getElementById('map'), options);
  $.each(obj, function(index, location) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(location["lat"], location["long"]), 
      title: location["name"],
      map: map
    });

    infobubble = new InfoBubble({
      map: map,
      content: '<div class="text">' + location["name"] +'</div>',
      position: new google.maps.LatLng(location["lat"], location["long"]),
      shadowStyle: 1,
      padding: 0,
      backgroundColor: 'rgb(57,57,57)',
      borderRadius: 4,
      arrowSize: 10,
      borderWidth: 1,
      borderColor: '#2c2c2c',
      disableAutoPan: true,
      hideCloseButton: false,
      arrowPosition: 30,
      backgroundClassName: 'infobubble',
      arrowStyle: 2
    });


    google.maps.event.addListener(marker, 'click', function() {
      infobubble.setContent('<div class="text">' + marker.title + '</div>');
      infobubble.open(map,marker);
    });


  });
  
}