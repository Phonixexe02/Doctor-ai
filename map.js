// map.js
document.addEventListener("DOMContentLoaded",()=>{
  const sidebarMap=document.getElementById("sidebarMap");
  const useLocationBtn=document.getElementById("useLocationBtn");
  const mapSearchInput=document.getElementById("mapSearchInput");
  const mapSearchBtn=document.getElementById("mapSearchBtn");
  let map,Lmarkers;

  function initMap(){
    map=L.map(sidebarMap).setView([27.7172,85.3240],12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
    Lmarkers=L.layerGroup().addTo(map);
  }

  async function searchClinics(lat,lon){
    if(!map)initMap();
    map.setView([lat,lon],14);
    Lmarkers.clearLayers();
    const url=new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q","hospital OR clinic");
    url.searchParams.set("format","json");
    url.searchParams.set("limit","20");
    url.searchParams.set("viewbox",`${lon-0.05},${lat+0.05},${lon+0.05},${lat-0.05}`);
    url.searchParams.set("bounded","1");
    const res=await fetch(url);
    const data=await res.json();
    data.forEach(p=>{
      const marker=L.marker([p.lat,p.lon]).bindPopup(p.display_name.split(",")[0]);
      Lmarkers.addLayer(marker);
    });
    // Create a new divIcon for the red dot
    const redDotIcon = L.divIcon({
      className: 'red-dot-icon',
      iconSize: [15, 15],
      iconAnchor: [7.5, 7.5]
    });
    L.marker([lat,lon],{icon:redDotIcon}).addTo(Lmarkers).bindPopup("You are here");
  }

  useLocationBtn?.addEventListener("click",()=>{
    if(!navigator.geolocation){
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos=>{
      searchClinics(pos.coords.latitude,pos.coords.longitude);
    },()=>{
      alert("Failed to get your location. Please ensure location services are enabled or try searching manually.");
      searchClinics(27.7172,85.3240); // Fallback to Kathmandu
    });
  });

  mapSearchBtn?.addEventListener("click",async()=>{
    const query=mapSearchInput.value;
    if(!query)return;
    const url=new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q",query);
    url.searchParams.set("format","json");
    url.searchParams.set("limit","1");
    const res=await fetch(url);
    const data=await res.json();
    if(data.length){
      searchClinics(data[0].lat,data[0].lon);
    }else{
      alert("Location not found.");
    }
  });

  initMap();
});