
import { mapConfig } from "../js/mapConfig.local.js";

import Map from "../lib/gis/5.1/@arcgis/core/Map.js";
import MapView from "../lib/gis/5.1/@arcgis/core/views/MapView.js";
import FeatureLayer from "../lib/gis/5.1/@arcgis/core/layers/FeatureLayer.js";

import Home from "../lib/gis/5.1/@arcgis/core/widgets/Home.js";
import LayerList from "../lib/gis/5.1/@arcgis/core/widgets/LayerList.js";
import Expand from "../lib/gis/5.1/@arcgis/core/widgets/Expand.js";

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

let selectedFeature, selectedHighlight, selectedLayerView = null;

// Get Feature Information Panel Elements
const featureInfoPanel = document.getElementById("featureInfoPanel");
const featureLayerTitle = document.getElementById("featureLayerTitle");
const featureInfoContent = document.getElementById("featureInfoContent");

// Display Feature Information
function showFeatureInfo(feature, layerTitle) {

    // Set Layer Title
    featureLayerTitle.textContent = layerTitle;

    // Clear Previous Information
    featureInfoContent.replaceChildren();

    // Get Feature Attributes
    const attributes = feature.attributes;

    // Create an HTML row for each attribute
    Object.entries(attributes).forEach(([fieldName, fieldValue]) => {

        const row = document.createElement("div");
        row.className = "feature-info-row";

        const label = document.createElement("div");
        label.className = "feature-info-label";
        label.textContent = fieldName;

        const value = document.createElement("div");
        value.className = "feature-info-value";
        value.textContent = fieldValue ?? "—";

        row.append(label, value);
        featureInfoContent.append(row);
    });

// Show Information Panel
    featureInfoPanel.hidden = false;
}

// Clear Selected Feature
function clearSelectedFeature() {

    // Remove Previous Highlight
    if (selectedHighlight) {
        selectedHighlight.remove();
        selectedHighlight = null;
    }

    // Reset Selection State
    selectedFeature = null;
    selectedLayerView = null;

    // Clear and Hide Information Panel
    featureInfoContent.replaceChildren();
    featureInfoPanel.hidden = true;

    console.log("Feature selection cleared.");
}

// Identify Feature
async function identifyFeature(event) {
    try {
        const response = await view.hitTest(event, {
            include: [
                landParcelLayer
            ]
        });

        const result = response.results.find(
            item =>
                item.type === "graphic" &&
                item.graphic.layer === landParcelLayer
        );

        if (!result) {
            clearSelectedFeature();
            return;
        }

        const feature = result.graphic;

        // Clear Pervious Feature
        clearSelectedFeature();

        // Get LayerView
        const layerView = await view.whenLayerView(landParcelLayer);

        // Store Selected Feature
        selectedFeature = feature;
        selectedLayerView = layerView;

        // Highlight Selected Feature
        selectedHighlight = layerView.highlight(feature);

        // Display Feature Information
        showFeatureInfo(feature, landParcelLayer.title);

        console.log("Selected Feature:", feature);
        console.log("Feature Attributes:", feature.attributes);

    } catch (error) {

        console.error(
            "Feature identification failed:",
            error
        );

    }
}

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
        

        // Add LayerList Widget
        const layerListWidget = new LayerList({
            view,            
        });

        // Add LayerList Expand
        const layerListExpand = new Expand({
            view,
         content: layerListWidget,
            expandIcon: "layers",
            expandTooltip: "Layer List",
            group: "top-right",
        });        
        view.ui.add(layerListExpand, "top-right");

        // Feature Information Panel Close Button
        const closeFeatureInfoButton = document.getElementById("closeFeatureInfoButton");

        closeFeatureInfoButton.addEventListener("click", () => {
            clearSelectedFeature();
        });

        // Feature Identification Click Event
        view.on("click", identifyFeature);

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
