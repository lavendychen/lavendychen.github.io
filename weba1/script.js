mapboxgl.accessToken = 'pk.eyJ1IjoibGF2ZW5keWNoZW4iLCJhIjoiY2t6eTd0MTUxMDMwbzJ2cGM1N2ppZHJsNCJ9.gsmv_rp9LgzS4hgOAuMVoA';

const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/lavendychen/cl0zjaxiq007g14lpv6hty0b9' // replace this with your style URL
});
  
const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search air quality in London", // Placeholder text for the search bar
  proximity: {
    longitude: 51.5074,
    latitude: 0.1272
  } // Coordinates of London center
});

map.addControl(geocoder, "top-left");

map.addControl(new mapboxgl.NavigationControl(), "top-left");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

map.on('load', () => {
  // the rest of the code will go in here
});

const layers = [
  '0-0.007',
  '0.007-961',
  '961-3439',
  '3439-7398',
  '7398-12580',
  '12580-751575'
];
const colors = [
  '#fee3d7',
  '#fcbba1',
  '#fc9373',
  '#fb6a4a',
  '#df2c26',
  '#a30f14'
];
// create legend
const legend = document.getElementById('legend');

layers.forEach((layer, i) => {
  const color = colors[i];
  const item = document.createElement('div');
  const key = document.createElement('span');
  key.className = 'legend-key';
  key.style.backgroundColor = color;

  const value = document.createElement('span');
  value.innerHTML = `${layer}`;
  item.appendChild(key);
  item.appendChild(value);
  legend.appendChild(item);
});

map.on('mousemove', (event) => {
  const states = map.queryRenderedFeatures(event.point, {
    layers: ['statedata']
  });
  document.getElementById('pd').innerHTML = states.length
    ? `<h3>${states[0].properties.name}</h3><p><strong><em>${states[0].properties.density}</strong> people per square mile</em></p>`
    : `<p>The relationship between the concentration of CO2 and the position of air quality monitor</p>`;
});

/* 
Add an event listener that runs
  when a user clicks on the map element.
*/
map.on('click', (event) => {
  // If the user clicked on one of your markers, get its information.
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['air-monitoring-s'] // replace with your layer name
  });
  if (!features.length) {
    return;
  }
  const feature = features[0];

  const popup = new mapboxgl.Popup({ offset: [0, -15] })
  .setLngLat(feature.geometry.coordinates)
  .setHTML(
  `<h3>${feature.properties.sitename}</h3>To find out about the levels of pollution measured at this site please <a href=${feature.properties.url}>see here</a>`
  )
  .addTo(map);
  // Code from the next step will go here.
});