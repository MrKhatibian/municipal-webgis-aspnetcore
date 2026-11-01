
import { mapConfig } from "../js/mapConfig.local.js";

import Map from "../lib/gis/5.1/@arcgis/core/Map.js";
import MapView from "../lib/gis/5.1/@arcgis/core/views/MapView.js";
import FeatureLayer from "../lib/gis/5.1/@arcgis/core/layers/FeatureLayer.js";

import Home from "../lib/gis/5.1/@arcgis/core/widgets/Home.js";

// Create Map
const map = new Map({
    basemap: mapConfig.map.basemap,
});

// Create MapView
const view = new MapView({
    container: mapConfig.view.container,
    map: map,
    center: mapConfig.view.center,
    zoom: mapConfig.view.zoom,
});

// Create FeatureLayer
function createFeatureLayer(layerConfig) {
    return new FeatureLayer({
        url: `${mapConfig.services.featureServer.url}/${layerConfig.id}`,
        title: layerConfig.title,
        outFields: layerConfig.outFields,
    });
}

// Create Operational Layers
const landParcelLayer = createFeatureLayer(
    mapConfig.layers.landParcel
);

const urbanAreaBoundaryLayer = createFeatureLayer(
    mapConfig.layers.urbanAreaBoundary
);

// Add Operational Layers
map.addMany([
    urbanAreaBoundaryLayer,
    landParcelLayer,
]);

// Initialize Map
async function initializeMap() {
    try {
        await view.when();

        // Load Operational Layers
        await Promise.all([
            landParcelLayer.load(),
            urbanAreaBoundaryLayer.load(),
        ]);

        console.log("Map initialized successfully.");
        console.log("Operational layers loaded successfully.");

        // Set Initial Extent
        const initialExtent = landParcelLayer.fullExtent;

        if (initialExtent) {
            await view.goTo(initialExtent);
        }

        // Add Home Widget
        const homeWidget = new Home({
            view,
            viewpoint: {
                targetGeometry: initialExtent,
            },
        });

        view.ui.add(homeWidget, "top-left");

    } catch (error) {
        console.error("Map initialization failed:", error);
    }
}

initializeMap();

export {
    map,
    view,
    landParcelLayer,
    urbanAreaBoundaryLayer,
};
