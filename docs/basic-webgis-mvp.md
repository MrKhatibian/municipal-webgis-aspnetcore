# Basic WebGIS MVP Scope

## 1. Objective

Deliver a functional Basic WebGIS application using ASP.NET Core MVC and the locally hosted ArcGIS Maps SDK for JavaScript 5.1.

The MVP builds on the existing map initialization foundation and introduces six essential GIS capabilities.

## 2. Required Capabilities

### 2.1 Add Operational ArcGIS Layers

- Load operational layers from a confirmed ArcGIS service.
- Display the selected layers on the map.
- Configure initial visibility and rendering.
- Handle service loading errors.

**Acceptance Criteria**
- At least one operational layer renders correctly.
- The layer uses the intended ArcGIS service.
- The existing basemap and map navigation continue to work.

### 2.2 Add Layer Visibility Controls

- Display the operational layers in a layer list.
- Allow users to turn individual layers on and off.
- Keep layer visibility synchronized with the map.

**Acceptance Criteria**
- All configured operational layers appear in the layer list.
- Users can change layer visibility.
- Visibility changes are reflected on the map.

### 2.3 Implement Feature Identification

- Allow users to select a feature on the map.
- Display relevant attributes in an information panel.
- Provide a way to close or clear the selected feature.

**Acceptance Criteria**
- Clicking a supported feature displays its attributes.
- The information panel identifies the selected feature clearly.
- Users can clear the selection and return to the map.

### 2.4 Implement Attribute Search

- Provide a search input for a selected attribute or identifier.
- Query the configured operational layer.
- Display matching results and navigate to a selected result.

**Acceptance Criteria**
- Users can search using the agreed field and input format.
- Matching results are displayed.
- Selecting a result identifies the corresponding feature on the map.
- Empty results and invalid input are handled clearly.

### 2.5 Add Measurement Tools

- Support distance measurement.
- Support area measurement.
- Provide a way to finish or clear a measurement.

**Acceptance Criteria**
- Users can measure distance on the map.
- Users can measure polygon area.
- Measurement results include appropriate units.
- Users can clear measurements without reloading the application.

### 2.6 Add Map Printing

- Provide a print action in the map interface.
- Allow users to produce a printable map output.
- Preserve the intended map extent and visible operational layers in the output.

**Acceptance Criteria**
- Users can initiate map printing from the application.
- The printed output includes the map at the intended extent.
- Visible operational layers are represented in the output.
- The selected printing approach and any required print service are documented.
- Printing failures provide useful feedback.

## 3. Implementation Order

1. Add Operational ArcGIS Layers
2. Add Layer Visibility Controls
3. Implement Feature Identification
4. Implement Attribute Search
5. Add Measurement Tools
6. Add Map Printing

## 4. Technical Constraints

- ASP.NET Core MVC
- .NET 10
- ArcGIS Maps SDK for JavaScript 5.1, hosted locally
- Existing map configuration and initialization should be preserved where practical.
- Avoid unrelated dependencies and unnecessary architectural changes.
- Keep each capability independently testable.

## 5. Decisions Required Before Implementation

- Confirm the ArcGIS service endpoint and selected operational layers.
- Confirm the search field and expected input format.
- Determine whether a suitable ArcGIS print service is available or whether another printing approach is required.
- Confirm the minimum supported browser and responsive layout requirements.

## 6. Out of Scope

- Feature editing and data creation
- User authentication and role management
- Advanced spatial analysis
- Advanced dashboards and reporting
- Enterprise deployment and production monitoring

## 7. Definition of Done

- All six required capabilities meet their acceptance criteria.
- The application builds and runs successfully.
- Existing map navigation remains functional.
- Errors and empty results are handled appropriately.
- Setup and usage documentation is updated.
- The implementation is committed and pushed to the repository.
