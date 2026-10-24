import { mapConfig } from "../js/mapConfig.js";

import Map from "../lib/gis/5.1/@arcgis/core/Map.js";
import MapView from "../lib/gis/5.1/@arcgis/core/views/MapView.js";

const map = new Map({
    basemap: mapConfig.map.basemap,
});

const view = new MapView({
    container: "mapView",
    map: map,
    center: mapConfig.view.center,
    zoom: mapConfig.view.zoom,
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