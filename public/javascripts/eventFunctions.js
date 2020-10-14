function buttonAdd(dbRequest, xhttp, mapsInit, geocoder,  map, arrayOff, arrayRest,
   red, blue, iconOff, iconRest) {
  const address = document.getElementById('address').value;
  const type = document.getElementById('type').value;

  if (address === null || address ===" " || address === "default")  //whattt
      alert("Data not Valid");
  else {
      geocodeAddress(geocoder,address, (error, result)=>{
          if (error){
              alert(error);
          } else
             if (type === 'restaurant' || type === 'Restaurant'){
              arrayRest.push(result);
              console.log(result);
              
              let item = {type: type, address:address}
              dbRequest.postReqInsert(item);
              mapsInit.pointDrawerBB(map, result, blue, iconRest, arrayRest);
              document.getElementById('address').value="";
              document.getElementById('type').value="";
          }else 
            if(type === 'office' || type === 'Office'){
              arrayOff.push(result);
              console.log(result);
              let item = { type: "office", address: address };
              dbRequest.postReqInsert(item, xhttp);
              mapsInit.pointDrawerBB(map, result, red, iconOff, arrayOff);

              console.log(item);
          } else{
            alert("Type not defined");
          }
      });

  }
}
function geocodeAddress(geocoder,address, callback) {
  geocoder.geocode( { 'address': address}, function(results, status) {

      if (status === 'OK') {
          const latlong = results[0].geometry.location;
          const nextPoint = {
              addr: address,
              position: { lat: latlong.lat(), lng: latlong.lng()}
          };
          console.log(nextPoint.position);
          callback(null, nextPoint);
      }else {
          callback("Geocode was not successful for the following reason: " + status, null);
      }
  });
}
function buttonAdd2(geocoder, mapsInit, map, array, color, icon, droplist, list, type, address) {
    alert(address);
    geocodeAddress(geocoder, map, address, (error, result) => {
      if (error) {
        alert(error);
      } else {
        array.push(result);
        mapsInit.pointDrawerBB(map, result, color, icon, array);
        console.log(array[array.length - 1]);
        addList(result, droplist, list);

        //inserimento a db (scomporre coordinate in string?)
      }
    });

}
function buttonInsert(geocoder, mapsInit, map, array, color, icon, droplist, list, type, address) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status === "OK") {
      const latlong = results[0].geometry.location;
      const nextPoint = {
        addr: address,
        position: { lat: latlong.lat(), lng: latlong.lng() },
      };
      array.push(result);
      mapsInit.pointDrawerBB(map, result, color, icon, array);
      console.log(array[array.length - 1]);
      addList(result, droplist, list);
      callback(null, nextPoint);
    } else {
      alert(status);

      callback(
        "Geocode was not successful for the following reason: " + status,
        null);
    }
  });
}

//async await

function geocodeAddress2(geocoder,map, address, callback) {
    geocoder.geocode( { 'address': address}, function(results, status) {


    if (status === "OK") {
      const latlong = results[0].geometry.location;
      const nextPoint = {
        addr: address,
        position: { lat: latlong.lat(), lng: latlong.lng() },
      };
      console.log(nextPoint.position);
      callback(null, nextPoint);
    } else {
      alert(status);

      callback(
        "Geocode was not successful for the following reason: " + status,
        null);
    }
  });
}

function deletePoint(marker, circle, array) {
  let txt;
  if (confirm("Delete the Marker?")) {
    txt = "You pressed OK!";
    let markerCoords = marker.getPosition();
    console.log(markerCoords);
    for (let i = 0; i < array.length; i++) {
      let arrayCoord = new google.maps.LatLng(array[i].position);
      if (arrayCoord.equals(markerCoords)) {
        array.splice(i, 1); // O(n)
        marker.setMap(null);
        circle.setMap(null);
        let event = new CustomEvent("pointDeleted");
        dispatchEvent(event);

        //inserire cancellazione db
      }
    }
  } else txt = "You pressed Cancel!";
  alert(txt);
}

//Calcolo area nel range visualizzato dalla mappa (richiede i bounds)
function countTotArea(map, ne, sw) {
  let latitudeNE = ne.lat();
  let latitudeSW = sw.lat();
  let longitudeNE = ne.lng();
  let longitudeSW = sw.lng();
  let myLatLngNEh = new google.maps.LatLng({
    lat: latitudeNE,
    lng: longitudeNE,
  });
  let myLatLngSWh = new google.maps.LatLng({
    lat: latitudeSW,
    lng: longitudeNE,
  });

  let myLatLngNEbase = new google.maps.LatLng({
    lat: latitudeSW,
    lng: longitudeNE,
  });
  let myLatLngSWbase = new google.maps.LatLng({
    lat: latitudeSW,
    lng: longitudeSW,
  });

  let h = google.maps.geometry.spherical.computeDistanceBetween(
    myLatLngNEh,
    myLatLngSWh
  );
  let base = google.maps.geometry.spherical.computeDistanceBetween(
    myLatLngSWbase,
    myLatLngNEbase
  );

  return h * base;
}

// function savePoint(array, type) {
//   let blob = new Blob([array[0].position], {
//     type: "text/plain;charset=utf-8",
//   });
//   saveAs(blob, "save" + type + ".txt");
// }

function eventCalculation(map, coverage, mapsInit) {
  let count = 0;
  let bound = map.getBounds();
  let ne = bound.getNorthEast();
  let sw = bound.getSouthWest();

  mapsInit.computeDistance(sw, ne);
  let area = countTotArea(map, ne, sw) / 1000000;
  let areaCirc = countCircles * 500 * Math.PI * 500;
  let strHTML =
    "North East: " +
    ne.lat().toFixed(4) +
    ", " +
    ne.lng().toFixed(4) +
    " </br>";
  strHTML += "South West: " + sw.lat().toFixed(4) + ", " + sw.lng().toFixed(4);

  document.getElementById("info").innerHTML = strHTML;
  document.getElementById("info2").innerHTML =
    "Area Visible Map: " + area.toFixed(2) + "Km^2";

  for (let i = 0; i < distancesRO.length; i++) {
    const dist = distancesRO[i];
    if (dist < 1000) count += coverage.segCircolare(dist);
  }
  distancesRO = []; //elimina le distanze già conteggiate
  const tempCount = count / 1000000;

  document.getElementById("info3").innerHTML =
    "Coverage Area" + " </br>" + tempCount.toFixed(3) + "Km^2";

  let diff = areaCirc - count;
  let areapercent = 0;
  if (diff !== 0 || diff > 0) {
    areapercent = (count / diff) * 100;
  } else areapercent = 0;

  document.getElementById("info4").innerHTML =
    "Area/Coverage" + " </br>" + areapercent.toFixed(2) + "%";

  //for (let i = 0; i<distancesRO.length; i++)        distancesRO.pop(); //elimina le distanze già conteggiate
}
