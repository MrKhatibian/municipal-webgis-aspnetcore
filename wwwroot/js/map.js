
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

// Identify Layers
const identifyLayers = [
    {
        layer: landParcelLayer,
        layerConfig: mapConfig.layers.landParcel
    },
    {
        layer: urbanAreaBoundaryLayer,
        layerConfig: mapConfig.layers.urbanAreaBoundary
    }
];

let selectedFeature, selectedHighlight, selectedLayerView = null;

// Get Feature Information Panel Elements
const featureInfoPanel = document.getElementById("featureInfoPanel");
const featureLayerTitle = document.getElementById("featureLayerTitle");
const featureInfoContent = document.getElementById("featureInfoContent");

// Get Attribute Value
function getAttributeValue(attributes, fieldName) {

    const value = attributes[fieldName];

    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return value;
}

// Create Attribute Row
function createFeatureInfoRow(labelText, valueText) {

    const row = document.createElement("div");
    row.className = "feature-info-row";

    const label = document.createElement("div");
    label.className = "feature-info-label";
    label.textContent = labelText;

    const value = document.createElement("div");
    value.className = "feature-info-value";
    value.textContent = valueText;

    row.append(label, value);

    return row;
}

// Create Attribute Group
function createFeatureInfoGroup(group, attributes) {

    const groupElement = document.createElement("section");
    groupElement.className = "feature-info-group";

    const header = document.createElement("div");
    header.className = "feature-info-group-header";

    const title = document.createElement("div");
    title.className = "feature-info-group-title";

    const icon = document.createElement("i");
    icon.className = `bi ${group.icon}`;

    const titleText = document.createElement("span");
    titleText.textContent = group.title;

    title.append(icon, titleText);

    header.append(title);

    const body = document.createElement("div");
    body.className = "feature-info-group-body";

    let hasVisibleFields = false;

    group.fields.forEach(field => {

        if (!Object.hasOwn(attributes, field.name)) {
            return;
        }

        const value = getAttributeValue(
            attributes,
            field.name
        );

        body.append(
            createFeatureInfoRow(field.label, String(value))
        );

        hasVisibleFields = true;
    });

    if (!hasVisibleFields) {
        return null;
    }

    groupElement.append(header, body);

    return groupElement;
}

// Display Feature Information
function showFeatureInfo(feature, layerConfig) {

    const attributes = feature.attributes;

    // Set Layer Subtitle
    const featureInfoSubTitle = document.getElementById("featureInfoSubTitle");
    featureInfoSubTitle.textContent = `اطلاعات ${layerConfig.title} انتخاب‌شده`;

    // Set Layer Title
    featureLayerTitle.textContent = layerConfig.title;

    // Set Unique Code Key
    const uniqCodeLabel = document.getElementById("uniqCodeLabel");
    uniqCodeLabel.textContent = `${layerConfig.featureUniqCodeFeild.label}:`;

    // Set Unique Code Value
    const uniqCode = document.getElementById("uniqCodeName");

    uniqCode.textContent = getAttributeValue(
        attributes,
        layerConfig.featureUniqCodeFeild.name
    );

    // Clear Previous Information
    featureInfoContent.replaceChildren();

    // Create Attribute Groups
    layerConfig.featureInfoGroups.forEach(group => {

        const groupElement = createFeatureInfoGroup(
            group,
            attributes
        );

        if (groupElement) {
            featureInfoContent.append(groupElement);
        }
    });

    // Show Empty State
    if (featureInfoContent.childElementCount === 0) {

        const emptyMessage = document.createElement("div");
        emptyMessage.className = "feature-info-empty";
        emptyMessage.textContent = "اطلاعاتی برای نمایش وجود ندارد.";

        featureInfoContent.append(emptyMessage);
    }

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
            include: identifyLayers.map(item => item.layer)
        });

        const result = response.results.find(
            item => {                
                if (item.type !== "graphic") {
                    return false;
                };

                return identifyLayers.some(
                    identifyLayer => identifyLayer.layer === item.graphic.layer
                );
            }
        );

        if (!result) {
            clearSelectedFeature();
            return;
        }

        const feature = result.graphic;

        // Find Selected Feature Configuration
        const selectedLayer = identifyLayers.find(
            item => item.layer === feature.layer
        )

        if (!selectedLayer) {
            clearSelectedFeature();
            return;
        }

        // Clear Pervious Feature
        clearSelectedFeature();

        // Get LayerView
        const layerView = await view.whenLayerView(selectedLayer.layer);

        // Store Selected Feature
        selectedFeature = feature;
        selectedLayerView = layerView;

        // Highlight Selected Feature
        selectedHighlight = layerView.highlight(feature);
        
        // Display Feature Information
        showFeatureInfo(feature, selectedLayer.layerConfig);

        console.log("selected Layer: ", selectedLayer.layerConfig.title);
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
        const closeFeatureInfoButton = document.getElementById("closeFeatureInfo");

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
