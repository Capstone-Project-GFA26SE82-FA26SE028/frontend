# Customer reservation API

The form loads restaurants using GET /api/online/restaurants and submits POST /api/reservations without staff credentials.

Request fields: restaurantId, requestedAreaId: null, contactName, phone, partySize, startAt. Time includes seconds and Vietnam +07:00 offset. The customer selects a restaurant; staff choose the area and tables when confirming. Notes are not supported by the current contract.

The reservation page may preselect restaurantId from its URL, but also works without query parameters. Legacy areaId/requestedAreaId URL parameters are ignored. No public area listing is required for customer creation under the new backend contract.

Only a successful response with a reservationId opens the success screen. Creation is pending review. Waiter retrieves it through the existing Pending reservations query and selects an area before checking table availability. Writes are not automatically retried.
