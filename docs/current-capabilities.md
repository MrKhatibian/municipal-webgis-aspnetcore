# Current WebGIS Capabilities

## 1. Project Overview

`municipal-webgis-aspnetcore` is an ASP.NET Core MVC application that provides the initial foundation for a WebGIS map viewer.

The application uses the locally stored ArcGIS Maps SDK for JavaScript 5.1 and separates map configuration from map initialization.

**Current maturity:** Map initialization foundation. The application is not yet a complete Basic WebGIS.

## 2. Implemented Capabilities

| Capability | Status | Implementation |
|---|---|---|
| ASP.NET Core MVC application | Implemented | MVC controllers, views, and shared layout |
| Map initialization | Implemented | `wwwroot/js/map.js` |
| Separate map configuration | Implemented | `wwwroot/js/mapConfig.js` |
| Basemap configuration | Implemented | Configurable `osm` basemap |
| Initial map center and zoom | Implemented | `mapConfig.js` |
| Local ArcGIS SDK loading | Implemented | Local SDK files under `wwwroot/lib/gis/5.1/` |
| Application layout and navigation | Implemented | `Views/Shared/_Layout.cshtml` |
| Bootstrap integration | Implemented | Local Bootstrap CSS and JavaScript |
| Basic initialization error handling | Partially Implemented | `try/catch` around map initialization |

## 3. Capabilities Not Yet Implemented

| Capability | Status |
|---|---|
| Operational layer management | Not Implemented |
| Layer visibility controls | Not Implemented |
| Feature identification | Not Implemented |
| Attribute information panel | Not Implemented |
| Attribute search | Not Implemented |
| Spatial and attribute queries | Not Implemented |
| Map measurement tools | Not Implemented |
| Drawing and graphics tools | Not Implemented |
| Map printing and export | Not Implemented |
| Application-specific GIS workflows | Not Implemented |
| Automated tests for WebGIS functionality | Not Implemented |

## 4. Current Technical Structure

```text
municipal-webgis-aspnetcore/
├── Controllers/
├── Views/
│   ├── Home/
│   │   ├── Index.cshtml
│   │   └── Privacy.cshtml
│   └── Shared/
│       └── _Layout.cshtml
├── wwwroot/
│   ├── css/
│   │   └── site.css
│   ├── js/
│   │   ├── map.js
│   │   ├── mapConfig.js
│   │   └── site.js
│   └── lib/
│       └── gis/
│           ├── arcgis_js_v51_api.zip
│           └── 5.1/
└── municipal-webgis-mvc.csproj
```

## 5. Architectural Notes

- Map configuration and map initialization are separated.
- The ArcGIS SDK is loaded from local files rather than a CDN.
- The application uses ASP.NET Core MVC for its server-side structure.
- Bootstrap provides the initial UI framework.
- The map initialization code exports the `map` and `view` objects for potential reuse.

## 6. Current Limitations

- The map does not yet contain operational GIS layers.
- Users cannot interact with feature attributes through an identification workflow.
- Search, query, measurement, drawing, and printing workflows are not available.
- The application has no defined end-to-end test coverage for its WebGIS features.

## 7. Next Step

Define the Basic WebGIS MVP scope, prioritize the required capabilities, and implement them incrementally with clear acceptance criteria.

No new functionality should be added as part of this inventory document.
