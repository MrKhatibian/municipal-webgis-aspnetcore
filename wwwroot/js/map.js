import { mapConfig } from "../js/mapConfig.local.js";

const [FeatureLayer, LayerSearchSource, Viewpoint] = await $arcgis.import([
    "@arcgis/core/layers/FeatureLayer.js",
    "@arcgis/core/widgets/Search/LayerSearchSource.js",
    "@arcgis/core/Viewpoint.js",
]);

// DOM references
const viewElement = document.getElementById("mapView");
const homeElement = document.getElementById("homeWidget");
const searchElement = document.getElementById("parcelSearch");

// Map configuration (set before the component finishes initializing)
viewElement.basemap = mapConfig.map.basemap;
viewElement.center = mapConfig.view.center;
viewElement.zoom = mapConfig.view.zoom;

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
    viewElement.map.addMany(operationalLayers);
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

    await viewElement.goTo(initialExtent, { animate: false });

    // Home button returns to the same extent
    homeElement.viewpoint = new Viewpoint({
        targetGeometry: initialExtent,
    });
}

function configureSearch() {
    // Sources are objects, so they are set from JS.
    // Selecting a result zooms to it and opens the layer's popup.
    searchElement.includeDefaultSources = false;
    searchElement.searchAllEnabled = false;
    searchElement.sources = [
        new LayerSearchSource({
            layer: landParcelLayer,
            searchFields: ["Code_nosazi"],
            displayField: "Code_nosazi",
            exactMatch: false,
            outFields: ["*"],
            name: "عرصه",
            placeholder: "کد نوسازی را وارد کنید...",
        }),
    ];
}

// Initialization
async function initializeMap() {
    try {
        // Wait for <arcgis-map> to create its MapView
        await viewElement.viewOnReady();

        addOperationalLayers();
        await loadOperationalLayers();
        await setInitialExtent();
        configureSearch();
    } catch (error) {
        console.error("Map initialization failed:", error);
    }
}

await initializeMap();

export { viewElement, landParcelLayer, urbanAreaBoundaryLayer };