//prova

//prova
let deleted;

let arrayRestaurant = [];
let arrayOffices = [];

let countOffList = 0;
let countRestList = 0;

const point1 = {
  seatings: 10,
  position: { lat: 45.829131, lng: 8.7846885 },
};
const point2 = {
  seatings: 10,
  position: { lat: 45.8375131, lng: 8.8846885 },
};
const point3 = {
  seatings: 10,
  position: { lat: 45.8365131, lng: 8.785885 },
};

const point4 = {
  employees: 10,
  position: { lat: 45.8225131, lng: 8.7846885 },
};
const point5 = {
  employees: 10,
  position: { lat: 45.8325131, lng: 8.8846885 },
};
const point6 = {
  employees: 10,
  position: { lat: 45.8265131, lng: 8.785885 },
};

let countCircles;
let map;
let distancesRO = [];
arrayRestaurant.push(point1);
arrayRestaurant.push(point2);
arrayRestaurant.push(point3);

arrayOffices.push(point4);
arrayOffices.push(point5);
arrayOffices.push(point6);

class InitMap {
  constructor() {}

  //crea i marker da un elemento pointer
  pointDrawerBB(map, element, color, markerIcon, array) {
    const coord = element.position;
    //add a circle to each point
    let circleElement = new google.maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: coord,
      radius: 500,
    });
    let markerElement = new google.maps.Marker({
      position: coord,
      map: map,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
    });
    google.maps.event.addListener(markerElement, "click", () => {
      deletePoint(markerElement, circleElement, array);
    });
  }

  //Calcolo distanza tra Uffici-Ristoranti se in range (boundLatLng)

  intoRangeCoords(startArray, outArray, count, sw, ne) {
    let newLatsw = sw.lat() - 0.0046;
    let newLngsw = sw.lng() - 0.0046;

    let newLatne = ne.lat() + 0.0046;
    let newLngne = ne.lng() + 0.0046;

    let tempsw = new google.maps.LatLng(newLatsw, newLngsw);
    let tempne = new google.maps.LatLng(newLatne, newLngne);

    // compl theta n^2
    const boundLatLng = new google.maps.LatLngBounds(tempsw, tempne);
    for (let i = 0; i < startArray.length; i++) {
      let compCoords = new google.maps.LatLng(startArray[i].position);
      if (boundLatLng.contains(compCoords)) {
        count++;
        let coord = new google.maps.LatLng(startArray[i].position);
        outArray.push(coord);
        //insert in array as latlng in bound
      }
    }
    return count;
  }

  computeDistance(sw, ne) {
    countCircles = 0;
    let restInto = [];
    let offInto = [];

    countCircles =
      this.intoRangeCoords(arrayOffices, offInto, countCircles, sw, ne) +
      this.intoRangeCoords(arrayRestaurant, restInto, countCircles, sw, ne);

    for (let tOffices = 0; tOffices < offInto.length; tOffices++) {
      for (
        let tRestaurants = 0;
        tRestaurants < restInto.length;
        tRestaurants++
      ) {
        let distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
          offInto[tOffices],
          restInto[tRestaurants]
        );
        distancesRO.push(distanceInMeters);
        console.log(distanceInMeters);
      }
    }
    console.log(countCircles);
  }
}


//funzione per inizializzare il programma
function initMap() {
  let listOff = document.getElementById("dropListOff");
  const red = "#FF0000";
  const blue = "#0000FF";
  const iconOff = {
    url: "/images/destinationOff.png",
    scaledSize: new google.maps.Size(35, 35),
  };
  const iconRest = {
    url: "/images/destinationRest.png",
    scaledSize: new google.maps.Size(35, 35),
  };
  let coverage = new Coverage();
  let mapsInit = new InitMap();
  const dbRequest = new DBrequest();
  const xhttp = new XMLHttpRequest();
  const geocoder = new google.maps.Geocoder();

  let mapDiv = document.getElementById("map");
  let mapOption = {
    center: new google.maps.LatLng(45.8225131, 8.7846885),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  let map = new google.maps.Map(mapDiv, mapOption);

 


  google.maps.event.addListener(map, "bounds_changed", function () {
    eventCalculation(map, coverage, mapsInit);
  });
  //eliminare e fare dopo la get
  for (let i = 0; i < arrayOffices.length; i++) {
    let el = arrayOffices[i];
    //addList(el,listOff, countOffList);
    mapsInit.pointDrawerBB(map, el, red, iconRest, arrayOffices);
  }
  for (let i = 0; i < arrayRestaurant.length; i++) {
    mapsInit.pointDrawerBB(map, arrayRestaurant[i], blue, iconOff, arrayRestaurant);
  }
  addEventListener("pointDeleted", function () {
    console.log("function called");

    eventCalculation(map, coverage, mapsInit);
  });

  //ajax request on click
  //post request
  document.getElementById("submit").addEventListener("click", function () {
    buttonAdd(dbRequest, xhttp, mapsInit, geocoder,  map, arrayOffices, 
      arrayRestaurant, red, blue, iconOff, iconRest);
    //savePoint(offices, "offices");
    console.log(arrayOffices[arrayOffices.length - 1]);
    eventCalculation(map, coverage, mapsInit);
  });
  //get request onclick
  document.getElementById("getData").addEventListener("click", function () {
    dbRequest.getData(xhttp);
    //update array e eventcalc
  });


//post request insert
  // document.getElementById("insert").addEventListener("click", function () {
  //   let type = document.getElementById("type").value;
  //   let address = document.getElementById("address").value;
  //   if(type.length === 0 || address.length === 0){
  //     alert("address or item field empty");
  //   }
  //   else{
  //     //aggiungi punto real time sulla mappa
  //     if(type === "restaurant" || type === "Restaurant"){
  //       buttonInsert(xhttp, geocoder, mapsInit, map, arrayRestaurant, blue, iconOff, listOff, countRestList, type, address);
  //       console.log(arrayRestaurant.length - 1);
  //       let item = { type: type, address: address };
  //       // postReqInsert(item);
  //       eventCalculation(map, coverage, mapsInit);

  //     } else if(type === "office" || type === "Office"){
  //       buttonInsert(geocoder, mapsInit, map, arrayOffices, red, iconRest, listOff, countOffList, type, address);
  //       console.log(arrayOffices[arrayOffices.length - 1]);
  //       eventCalculation(map, coverage, mapsInit);
  //     }
  //     else{
  //       alert("type must be 'office' or 'restaurant' ");
  //     }
      
  //   }
    
  // });

  ////versione precedente
  
  // document.getElementById("addMarkRest").addEventListener("click", function () {
  //   buttonAdd(map, restaurant, blue, icon1, listOff, countRestList);
  //   savePoint(restaurant, "offices");
  //   console.log(restaurant.length - 1);
  //   eventCalculation(map, coverage, mapsInit);
  // });
}
