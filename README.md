This app is live at https://viktorzvarych.github.io/Car-Table-for-CHI-IT/
This app was created with Vanilla JS

1. This app contains table with cars list. Table contains listed columns. Table uses pagination locally. Search on top of the table works accross all entries, not only listed page.
  - Company
  - Model
  - VIN
  - Color
  - Year
  - Price
  - Availability
  - Actions columns

2. Actions column contain dropdown with listed actions. Each option opens respected modal window.
  - Edit
  - Delete

3. Edit modal contains all data for selected car, but only some fields are editable
  - Disabled:
    - Company
    - Model
    - VIN
    - Year
  - Enabled:
    - Color
    - Price
    - Availability

4. Delete modal contains question is user sure he wants to perform this action.

5. Page contains "Add car" button that opens add modal. Add modal is similar to Edit modal, but all fields are enabled and empty by default

6. All user actions affect the table. Data is be saved between page reloads

7. API to get initial data - https://documenter.getpostman.com/view/5596891/SW7eyRFV?version=latest#d10a962e-a3de-4c0e-9fda-7d472c20ba24
