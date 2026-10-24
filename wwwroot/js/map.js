import Map from "../lib/gis/5.1/@arcgis/core/Map.js";
import MapView from "../lib/gis/5.1/@arcgis/core/views/MapView.js";

const map = new Map({
    basemap: "osm",
});

const view = new MapView({
    container: "mapView",
    map: map,
    center: [51.4, 35.7], //Iran, Tehran
    zoom: 12
});

async function initializedMap() {
    try {
        await view.when();
        console.log("map initailized!")
    } catch (err) {
        console.warn(err)
    }    
}
initializedMap();

export { map, view };