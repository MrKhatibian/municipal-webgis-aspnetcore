# Municipal WebGIS

A WebGIS application built with **ASP.NET Core MVC** and **ArcGIS Maps SDK for JavaScript**.

This project explores the development of web-based GIS applications using the .NET ecosystem and ArcGIS mapping technologies.

## Technologies

- **Backend:** ASP.NET Core MVC, C#
- **Frontend:** HTML, CSS, JavaScript
- **Mapping:** ArcGIS Maps SDK for JavaScript
- **UI:** Bootstrap
- **Development tools:** .NET SDK, Node.js, npm

## Project Goals

- Integrate interactive maps into an ASP.NET Core MVC application.
- Explore map navigation and mapping widgets.
- Organize frontend assets and JavaScript modules.
- Explore the integration of GIS services into web applications.
- Build a maintainable foundation for a municipal WebGIS.

## Getting Started

## Prerequisites

- .NET 10 SDK
- PowerShell (Windows)
- Git

## Clone the Repository

```powershell
git clone https://github.com/MrKhatibian/municipal-webgis-aspnetcore.git
cd municipal-webgis-aspnetcore
```

## Set Up the Local ArcGIS Maps SDK

The repository includes the ArcGIS Maps SDK 5.1 ZIP archive at:

```text
wwwroot/lib/gis/arcgis_js_v51_api.zip
```

The extracted SDK files are not committed to the repository. Extract the archive into `wwwroot/lib/gis/` before running the application.

From the repository root, run:

```powershell
tar -xf .\wwwroot\lib\gis\arcgis_js_v51_api.zip -C .\wwwroot\lib\gis\
```

The expected directory structure includes:

```text
wwwroot/lib/gis/
├── arcgis_js_v51_api.zip
└── 5.1/
    ├── @arcgis/core/
    │   ├── Map.js
    │   └── views/MapView.js
    └── esri/themes/light/main.css
```

Verify that the required files exist:

```powershell
Test-Path .\wwwroot\lib\gis\5.1\@arcgis\core\Map.js
Test-Path .\wwwroot\lib\gis\5.1\@arcgis\core\views\MapView.js
Test-Path .\wwwroot\lib\gis\5.1\esri\themes\light\main.css
```

All three commands should return `True`.

## Build and Run

Restore dependencies and build the application:

```powershell
dotnet restore
dotnet build
```

Run the application:

```powershell
dotnet run
```

Open the HTTPS URL displayed in the terminal and verify that the map loads successfully.

## Notes

- Extract the SDK locally after cloning; do not commit the extracted SDK directory.
- Keep the SDK ZIP archive in the repository as the distribution source for local setup.
- Preserve the directory structure expected by the imports in `wwwroot/js/map.js` and the stylesheet reference in `Views/Shared/_Layout.cshtml`.
- If the SDK archive is updated, repeat the extraction and verification steps.

## Project Status

Under development. Features and architecture may evolve as the project progresses.

## Author

**MrKhatibian**

- GitHub: [@MrKhatibian](https://github.com/MrKhatibian)

## License

No license has been specified yet. All rights reserved unless a license is added to this repository.
