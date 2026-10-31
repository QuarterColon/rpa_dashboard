# Operations runbook

## Live setup

Set `A360_BASE_URL`, `A360_WLM_VERSION=v3`, and either an OAuth bearer token or A360 username/API key in the server environment. Username/password is also supported if enabled in the Control Room. Start the app and load the dashboard. Queue listing and work-item requests run on demand; no demo data or database is used.

## Troubleshooting

The UI displays sanitized A360 HTTP errors. Check the configured base URL, authentication method, token validity, queue permissions, API version, and request-body schema against the target Control Room Swagger. Never place tokens, raw payloads, or sensitive error text in logs or screenshots. If lifecycle fields are absent, leave them unavailable rather than substituting refresh time. Retry counts and activity correlation are not inferred without source identifiers.
