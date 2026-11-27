# Customer reservation hook

useReservation loads public restaurants with TanStack Query and submits createReservation with useMutation. Writes use retry: false. The form retains entered values on failure and disables submission while pending. A transport failure reports that the result is uncertain instead of silently retrying.

Validation and payload checks: node --experimental-strip-types --test scripts/customer-reservation.test.mjs.
