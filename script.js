//intialize variables
var map;
var marker;

//the initialize function wraps the entire program and allows it to be called in the google maps event listener at the bottom so it runs on load
initialize = () => {

    /*set up the map options from the google maps API centering the map at a latitude of zero and longitude of zero
        takes parameters of the element where the map should be displayed and the options for the map*/
    var mapOptions = {
        zoom: 2.5,
        center: new google.maps.LatLng(0, 0),
    };
        map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    //setLocation function allows the marker to be updated dynamically with change of API data by fetching the data and re-positing the marker at an interval of 1 second
    setLocation = () => {
    //use javascript fetch method to connect to "Where The ISS At" API
        fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then((resp) => resp.json())
        .then(function(data) {
        
        // set the latitude and longitute variable equal to the latitude and longitude returned from the API
        let lat = data.latitude
        let long = data.longitude

        //set a varible for the google maps latitude and longitude using API Date
        let latLong = new google.maps.LatLng(lat, long)

        updateLatLong(lat, long);

        /*if the marker already exists then update its latitude and longitude using the setPosition method, if the marker does not exist
            then create a new google maps marker, set its latitude and longitude and render it on the map*/
        if(marker != undefined) {
            marker.setPosition(latLong)
        } else {
            marker = new google.maps.Marker ({
            position: latLong,
            icon: "./smallspaceshuttle.png",
            map: map,
        })
        }
    })
    .catch(function(error) {
      console.log(JSON.stringify(error));
    });
    }

    //use the setInterval function to update the location of the marker every second
    setInterval(function() {
        setLocation()
    }, 1000)
  }

  function updateLatLong(lat, long) {
      document.getElementById('lat').innerHTML = `latitude: ${lat}`
      document.getElementById('lng').innerHTML = `longitude: ${long}`
  }
  
  //load the map on window load
  google.maps.event.addDomListener(window, 'load', initialize);