// The location of warsaw
var pandaria = {
    lat: 52.218017,
    lng: 21.018629
}

var cofeina = {
    lat: 52.219894, 
    lng: 21.013120
};

var etnocafe = {
    lat: 52.218861,
    lng: 21.015033
}

// global variable
var map;
var markers = [];
var infoWindow;
// Initialize and add the map
function initMap() {
// The map, centered at
map = new google.maps.Map(document.getElementById('map'), {
    center: cofeina,// set center of map
    zoom: 12,
    styles: [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
    },
    {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
    },
    {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
    },
    {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
    },
    {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
    },
    {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
    },
    {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
    },
    {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
    },
    {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
    },
    {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
    },
    {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
    },
    {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
    },
    {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
    },
    {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
    },
    {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
    }
    ],

});
    // The example marker, positioned at warsaw
    var marker1 = new google.maps.Marker({position: pandaria, map: map, animation: google.maps.Animation.DROP,});
    var marker2 = new google.maps.Marker({position: cofeina, map: map, icon: 'https://raw.githubusercontent.com/mayujie/Resource/master/assets-icons/icons8-hot-coffee-64.png', animation: google.maps.Animation.DROP,});
    var marker3 = new google.maps.Marker({position: etnocafe, map: map, icon: {url: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', scaledSize: new google.maps.Size(40, 50)}, animation: google.maps.Animation.DROP,});
// define the info windonw
    infoWindow = new google.maps.InfoWindow();
    
    // displayStores(storesWarsaw);
    searchStores();    
    // showStoresMarkers();
    // setOnClickListener();
}

// function to search stores through zip code
function searchStores(){
    // create empty list for storing found stores
    var foundStores = [];
    // get input element's value from search box
    var zipCode = document.getElementById('zip-code-input').value;
    
    // if zipcode exists display them
    if(zipCode){        
        // console.log(zipCode); // debug show searched content
        storesWarsaw.forEach(function(store){
            var postal = store.address.postalCode;
            var postal_part = store.address.postalCode.substring(0,3); // get part of post code
            // console.log(postal);
            if(postal_part==zipCode || postal==zipCode){
                // if found push store data
                foundStores.push(store);
            }
        });
    // otherwise, them list all
    }else{
        foundStores = storesWarsaw;
    }
    // 1st clear all
    clearLocations();    
    // console.log(foundStores); // print found result
    // passed in found stores
    displayStores(foundStores);
    // display store markers
    showStoresMarkers(foundStores);
    setOnClickListener();
}

// function to clear all markers
function clearLocations(){
    infoWindow.close();
    // loop through markers and set each to null 
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0; // set list length to 0
}

// set click listener to item in the list
function setOnClickListener(){
    // console.log(markers); // debugging
    var storeElement = document.querySelectorAll('.store-container')
    // console.log(storeElement);// debugging
    // loop through all elements
    storeElement.forEach(function(elem, index){
        // add event listener 
        elem.addEventListener('click', function(){                 
            // console.log(index);
            google.maps.event.trigger(markers[index], 'click');// markers is empty list at beginning
        })
    });
}


// function to display the stores on list
function displayStores(stores){
    
    var storesHtml = "";
    stores.forEach(function(store, index){
        // console.log(store); // For debugging
        var address = store.addressLines;
        var phone = store.phoneNumber;
        if(phone == null){
            phone = "No phone number yet."
        }

        // Template literals
        storesHtml += `                
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]},</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>  
                    </div>
                </div>    
            </div>`
    });
    document.querySelector('.stores-list').innerHTML = storesHtml
    
}

// show all stores marker on the map and fit bounds of map
function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds(); // get to know list of bounds

    stores.forEach(function(store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        
        // console.log(latlng); // debugging
        var name = store.name;
        var openStatus = store.openStatusText;
        var address = store.addressLines[0];
        var tele = store.phoneNumber;

        bounds.extend(latlng); //extend bounds by adding latlng object
        createMarker(latlng, name, openStatus, address, tele, index) 
    })
    map.fitBounds(bounds); //fit the bounds of the map in order to showing all markers in the view
}

// function to create a marker
function createMarker(latlng, name, openStatus, address, tele, index) {
    var html = `
    <div class="store-info-window">
        <div class="store-info-name">
            <b>${name}</b>
        </div>

        <div class="store-info-status">
            ${openStatus}
        </div>

        <div class="store-info-address">
            <div class="circle">
                <i class="fas fa-map-marked-alt"></i>
            </div>                
            <a href="https://www.google.com/maps/dir/?api=1&origin=cafenia,Warsaw&destination=${address}&travelmode=driving" target="_blank">
            ${address}
            </a>                
        </div>

        <div class="store-info-phone">
            <div class="circle">
                <i class="fas fa-phone-alt"></i>
            </div>
            <span>
            ${tele}
            </span>
        </div>

    </div>`;

    var image = {
        // url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // url: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',
        url: 'https://raw.githubusercontent.com/mayujie/Resource/master/assets-icons/starbucks-226353.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(50, 50),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
        // stretch/shrink an image or a sprite
        scaledSize: new google.maps.Size(40, 40),
        // adjust icon above label 
        labelOrigin: new google.maps.Point(20, 47)

    };
      
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: image,
    //   draggable: true,
      animation: google.maps.Animation.DROP,
      label: {
        text: `${index+1}`, //index.toString() // +1 here fix the starting number
        color: 'white',
        fontSize: '14px',
        fontWeight: '1000'
        }
    });
    // set info window when click the marker, could use click / mouseover
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    // add marker to markers list
    markers.push(marker);
  }