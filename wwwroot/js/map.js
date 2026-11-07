import { mapConfig } from "../js/mapConfig.local.js";

const [FeatureLayer, LayerSearchSource, Viewpoint] = await $arcgis.import([
    "@arcgis/core/layers/FeatureLayer.js",
    "@arcgis/core/widgets/Search/LayerSearchSource.js",
    "@arcgis/core/Viewpoint.js",
]);

// DOM references
const view = document.getElementById("mapView");
const home = document.getElementById("homeWidget");
const search = document.getElementById("parcelSearch");

// Map configuration (set before the component finishes initializing)
view.basemap = mapConfig.map.basemap;
view.center = mapConfig.view.center;
view.zoom = mapConfig.view.zoom;

// Popup template (built from mapConfig.featureInfoGroups)
function buildPopupTemplate(layerConfig) {
    const { name, label } = layerConfig.featureUniqCodeFeild;

    return {
        title: `${layerConfig.title} (${label}: \u2066{${name}}\u2069)`, // for LtR
        outFields: layerConfig.outFields,        
        content: layerConfig.featureInfoGroups.map(group => ({
            type: "fields",
            title: group.title,
            fieldInfos: group.fields.map(field => ({
                fieldName: field.name,
                label: field.label,
                format: field.format,
            })),
        })),
    };
}

// Operational layers
function createFeatureLayer(layerConfig) {
    return new FeatureLayer({
        url: `${mapConfig.services.featureServer.url}/${layerConfig.id}`,
        title: layerConfig.title,
        outFields: layerConfig.outFields,
        popupTemplate: buildPopupTemplate(layerConfig),
    });
}

const landParcelLayer = createFeatureLayer(mapConfig.layers.landParcel);
const urbanAreaBoundaryLayer = createFeatureLayer(mapConfig.layers.urbanAreaBoundary);

// Drawing order: first item is at the bottom
const operationalLayers = [urbanAreaBoundaryLayer, landParcelLayer];

// Initialization steps
function addOperationalLayers() {
    // The component already owns the Map instance
    view.map.addMany(operationalLayers);
}

async function loadOperationalLayers() {
    // allSettled: one failing layer must not break the whole map
    const results = await Promise.allSettled(
        operationalLayers.map(layer => layer.load())
    );

    results.forEach((result, index) => {
        if (result.status === "rejected") {
            console.error(
                `Layer "${operationalLayers[index].title}" failed to load:`,
                result.reason
            );
        }
    });
}

async function setInitialExtent() {
    const initialExtent = landParcelLayer.fullExtent;

    if (!initialExtent) {
        return;
    }

    await view.goTo(initialExtent, { animate: false });

    // Home button returns to the same extent
    home.viewpoint = new Viewpoint({
        targetGeometry: initialExtent,
    });
}

async function configureSearch() {
    // Sources are objects, so they are set from JS.
    // Selecting a result zooms to it and opens the layer's popup.
    await search.componentOnReady();    

    search.includeDefaultSourcesDisabled = mapConfig.search.includeDefaultSourcesDisabled;
    search.allPlaceholder = mapConfig.search.allPlaceholder;
    search.locationDisabled = mapConfig.search.locationDisabled;

    // Search Layers Sources
    const searchSourceLandParcel = mapConfig.layers.landParcel.searchSource;
    const searchSourceUrbanAreaBounddary = mapConfig.layers.urbanAreaBoundary.searchSource;

    search.sources = [
        {
            layer: landParcelLayer,
            searchFields: searchSourceLandParcel.searchFields,
            suggestionTemplate: searchSourceLandParcel.suggestionTemplate,
            displayField: searchSourceLandParcel.displayField,
            exactMatch: searchSourceLandParcel.exactMatch,
            outFields: searchSourceLandParcel.outFields,
            name: searchSourceLandParcel.name,
            placeholder: searchSourceLandParcel.placeholder,
        },
        {
            layer: urbanAreaBoundaryLayer,
            searchFields: searchSourceUrbanAreaBounddary.searchFields,
            suggestionTemplate: searchSourceUrbanAreaBounddary.suggestionTemplate,
            exactMatch: searchSourceUrbanAreaBounddary.exactMatch,
            outFields: searchSourceUrbanAreaBounddary.outFields,
            name: searchSourceUrbanAreaBounddary.name,
            placeholder: searchSourceUrbanAreaBounddary.placeholder,
        },       
    ];
}

// Initialization
async function initializeMap() {
    try {
        // Wait for <arcgis-map> to create its MapView
        await view.viewOnReady();       
        
        addOperationalLayers();
        await loadOperationalLayers();
        await setInitialExtent();
        configureSearch();
    } catch (error) {
        console.error("Map initialization failed:", error);
    }
}

await initializeMap();

export { view, landParcelLayer, urbanAreaBoundaryLayer };