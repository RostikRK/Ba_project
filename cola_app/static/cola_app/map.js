const map = L.map('map').setView([outlets[0].Lat, outlets[0].Lon], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'legend');
  const colors = ['red', 'brown', 'orange', 'yellow', 'green'];
  const labels = ['< 0.2', '0.2 - 0.4', '0.4 - 0.6', '0.6 - 0.8', '0.8 - 1'];

  div.innerHTML = '<b>Success probability:</b><br>';
   for (let i = 0; i < colors.length; i++) {
    div.innerHTML +=
      '<input type="checkbox" class="marker-checkbox" data-color="' +
      colors[i] +
      '" checked> ' +
      '<i style="background:' +
      colors[i] +
      '"></i> ' +
      labels[i] +
      '<br>';
  }

  return div;
};

legend.addTo(map);

const markersByColor = {
  red: [],
  brown: [],
  orange: [],
  yellow: [],
  green: [],
};
outlets.forEach(outlet => {
  const markerColor = outlet.successChanceCombo > 0.8 ? 'green' :
                      outlet.successChanceCombo > 0.6 ? 'yellow' :
                      outlet.successChanceCombo > 0.4 ? 'orange' :
                      outlet.successChanceCombo > 0.2 ? 'brown' : 'red';

  const markerIcon = L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  const marker = L.marker([outlet.Lat, outlet.Lon], { icon: markerIcon }).addTo(map);
  marker.bindPopup(`<b>${outlet.Outlet_Name}</b><br>Category: ${outlet.Category_Tier_1}<br>Rating: ${outlet.Rating}<br>Success probability: ${outlet.successChanceCombo}`);

  markersByColor[markerColor].push(marker);
});

function onCheckboxChange(e) {
  const color = e.target.getAttribute('data-color');
  const isChecked = e.target.checked;

  // Show or hide markers based on the checkbox state
  markersByColor[color].forEach((marker) => {
    if (isChecked) {
      marker.addTo(map);
    } else {
      marker.remove();
    }
  });
}

const checkboxes = document.querySelectorAll('.marker-checkbox');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', onCheckboxChange);
});