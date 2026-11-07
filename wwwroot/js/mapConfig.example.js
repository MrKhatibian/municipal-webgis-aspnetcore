/**
 * ============================================================
 * Municipal WebGIS - Map Configuration (Example)
 * ============================================================
 *
 * Purpose:
 * Centralized configuration for the WebGIS map, ArcGIS
 * services, and operational layers.
 *
 * Setup Instructions:
 * 1. Copy this file.
 * 2. Rename the copied file to mapConfig.js.
 * 3. Update the ArcGIS service URL with your actual URL.
 * 4. Configure the map and operational layers as required.
 *
 * Important:
 * - Commit this example file to GitHub.
 * - Do not commit mapConfig.js if it contains internal
 *   service addresses.
 * - Client-side service URLs are visible in browser tools.
 *
 * ============================================================
 */

const mapConfig = {

    /**
     * --------------------------------------------------------
     * Map Configuration
     * --------------------------------------------------------
     *
     * General settings for creating the ArcGIS Map.
     */

    map: {
        // Basemap used as the map's background.
        // Examples: osm, streets, satellite, topo-vector
        basemap: "osm",
    },

    /**
     * --------------------------------------------------------
     * MapView Configuration
     * --------------------------------------------------------
     *
     * Initial settings for the 2D map view.
     */

    view: {
        // HTML element ID used as the map container.
        container: "mapView",

        // Initial map center [longitude, latitude].
        // Example coordinates point to Tehran, Iran.
        center: [51.4, 35.7],

        // Initial zoom level.
        zoom: 9,
    },

    /**
     * --------------------------------------------------------
     * ArcGIS Services Configuration
     * --------------------------------------------------------
     *
     * Base URLs for ArcGIS Server services.
     *
     * Do not include individual layer IDs in these URLs.
     * Layer IDs are defined separately in the layers section.
     */

    services: {

        // FeatureServer endpoint.
        // Used by FeatureLayer to access feature data.
        featureServer: {
            url: "https://YOUR-ARCGIS-SERVER/arcgis/rest/services/YOUR-FOLDER/YOUR-SERVICE/FeatureServer",
        },

        // MapServer endpoint.
        // Optional: used when MapImageLayer or other
        // MapServer-based layers are added.
        mapServer: {
            url: "",
        },

        // Optional ArcGIS utility services.
        geometryServer: {
            url: "",
        },

        geocodingServer: {
            url: "",
        },

        printingServer: {
            url: "",
        },

        routingServer: {
            url: "",
        },
    },

    /**
     * --------------------------------------------------------
     * Search Configuration
     * --------------------------------------------------------
     *
     * Configure the Esri Search Component.
     *
     * Each source references an operational layer by its
     * configuration key from the layers section.
     */

    search: {
        // Disable Esri's default search sources.
        includeDefaultSourcesDisabled: true,

        // Placeholder displayed when searching across sources.
        allPlaceholder: "جستجو در لایه‌های نقشه...",

        // Disable location search.
        locationDisabled: true,
    },

    /**
     * --------------------------------------------------------
     * Operational Layers Configuration
     * --------------------------------------------------------
     *
     * Define the operational layers displayed on the map.
     *
     * Each layer configuration contains:
     * - id: ArcGIS service sublayer ID.
     * - title: Display name shown in the application.
     * - outFields: Feature attributes requested from the service.
     *
     * Add new operational layers here as the project grows.
     */

    layers: {

        // Land Parcel Layer (عرصه)
        landParcel: {
            id: 4,
            title: "عرصه",
            outFields: ["*"],

            // Feature Unique Code
            featureUniqCodeFeild: {
                name: "Code_nosazi",
                label: "کد نوسازی",
            },

            // Display Feature Information
            featureInfoGroups: [
                {
                    title: "اطلاعات شناسایی",
                    icon: "bi-person",
                    fields: [
                        {
                            name: "Code_nosazi",
                            label: "کد نوسازی",
                        },
                        {
                            name: "Karbari",
                            label: "کاربری",
                        },
                        {
                            name: "OBJECTID",
                            label: "شناسه عارضه",
                        },
                    ],
                },
                {
                    title: "اطلاعات هندسی",
                    icon: "bi-rulers",
                    fields: [
                        {
                            name: "Masahat",
                            label: "مساحت",
                            format: { digitSeparator: true, places: 2 }
                        },
                        {
                            name: "Frequency",
                            label: "محیط",
                            format: { digitSeparator: true, places: 2 }
                        },
                    ],
                },
                {
                    title: "اطلاعات شهرسازی",
                    icon: "bi-building",
                    fields: [
                        {
                            name: "Parvaneh",
                            label: "قیمت پایه منطقه",
                            format: { digitSeparator: true,}
                        },
                    ],
                },
            ],

            // Land Parcel Search (عرصه)
            searchSource: {
                searchFields: ["Code_nosazi"],
                suggestionTemplate: "{Code_nosazi}",
                displayField: "Code_nosazi",

                exactMatch: false,
                outFields: ["*"],

                name: "عرصه",
                placeholder: "کد نوسازی را وارد کنید...",
            }
        },

        // Urban Area Boundary Layer (محدوده شهر)
        urbanAreaBoundary: {
            id: 2,
            title: "محدوده شهر",
            outFields: ["*"],

            // Feature Unique Code
            featureUniqCodeFeild: {
                name: "OBJECTID",
                label: "شناسه عارضه",
            },

            // Display Feature Information
            featureInfoGroups: [
                {
                    title: "اطلاعات شناسایی",
                    icon: "bi-person",
                    fields: [
                        {
                            name: "OBJECTID",
                            label: "شناسه عارضه",
                        },
                    ],
                },
            ],

            // Urban Area Boundary Search (محدوده شهر)
            searchSource: {
                searchFields: ["OBJECTID"],
                suggestionTemplate: "{OBJECTID}",

                exactMatch: false,
                outFields: ["*"],

                name: "محدوده شهر",
                placeholder: "کد محدوده را وارد کنید...",
            }
        },

        // Example: Building Layer (اعیان)
        building: {
            id: 0,
            title: "اعیان",
            outFields: ["*"],

            // Feature Unique Code
            featureUniqCodeFeild: {
                name: "OBJECTID",
                label: "شناسه عارضه",
            },

            // Display Feature Information
            featureInfoGroups: [
                {
                    title: "اطلاعات شناسایی",
                    icon: "bi-person",
                    fields: [
                        {
                            name: "OBJECTID",
                            label: "شناسه عارضه",
                        },
                    ],
                },
            ],
        },

        // Example: Detailed Plan Layer (طرح تفصیلی)
        detailedPlan: {
            id: 3,
            title: "طرح تفصیلی",
            outFields: ["*"],

            // Feature Unique Code
            featureUniqCodeFeild: {
                name: "OBJECTID",
                label: "شناسه عارضه",
            },

            // Display Feature Information
            featureInfoGroups: [
                {
                    title: "اطلاعات شناسایی",
                    icon: "bi-person",
                    fields: [
                        {
                            name: "OBJECTID",
                            label: "شناسه عارضه",
                        },
                    ],
                },
            ],
        },
    },
};

export { mapConfig }; 