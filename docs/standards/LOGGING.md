# Pet Shop logging standard

The application emits structured operational events. It does not use logs as product analytics,
an audit ledger, or payload debugging.

## Runtime flow

```text
browser failure -> validated /api/observability/client-errors -> Pino JSON stdout
Next.js server  -> Pino JSON stdout
customFetcher  -> correlated backend request -> Pino completion event
JSON stdout    -> Grafana Alloy/Promtail -> Loki -> Grafana
```

Grafana and Loki are deployment-owned and optional. The application never pushes synchronously to
Loki from a request path.

## Privacy and security

Never log tokens, cookies, passwords, OTPs, sessions, personal information, request/response bodies,
headers, form values, files, signed URLs, full URLs, or arbitrary objects. Browser reports use a
closed schema and cannot set timestamp, severity, service identity, environment, or user identity.

`X-Request-ID` accepts only `^[A-Za-z0-9._:-]{8,128}$`; invalid or missing values are replaced. It is
correlation metadata, never authentication or authorization.

## Registered events

| Event                           | Default level          | Owner             | Purpose                                          |
| ------------------------------- | ---------------------- | ----------------- | ------------------------------------------------ |
| `http.upstream.completed`       | debug/error by outcome | frontend platform | One completion per backend call                  |
| `http.request.failed`           | error                  | frontend platform | Unexpected internal API failure                  |
| `server.unexpected_error`       | error                  | frontend platform | Uncaught render, route, action, or proxy failure |
| `client.unexpected_error`       | error                  | frontend platform | Actionable browser/runtime failure               |
| `logging.client_event_rejected` | warn                   | frontend platform | Invalid browser telemetry without payload echo   |

Routine successful requests, renders, clicks, touches, navigation, polling, and validation failures
are not production info events. Pointer, keyboard, and submit activity is retained only as a bounded
five-second context marker on an actionable browser failure.

## Environment contract

| Variable                                     | Purpose                                           | Default              |
| -------------------------------------------- | ------------------------------------------------- | -------------------- |
| `LOG_LEVEL`                                  | `debug`, `info`, `warn`, `error`, or `silent`     | `info` in production |
| `LOG_SERVICE_NAME`                           | Stable Loki service label                         | `petshop-frontend`   |
| `LOG_ENVIRONMENT`                            | Stable deployment environment                     | `NODE_ENV`           |
| `RELEASE_VERSION`                            | Release identifier                                | omitted              |
| `CLIENT_ERROR_REPORTING_ENABLED`             | Enables the protected collector                   | disabled             |
| `CLIENT_TELEMETRY_EDGE_RATE_LIMITED`         | Confirms production distributed rate limiting     | disabled             |
| `NEXT_PUBLIC_CLIENT_ERROR_REPORTING_ENABLED` | Enables browser reporting                         | disabled             |
| `NEXT_PUBLIC_CLIENT_ERROR_SAMPLE_RATE`       | Deterministic browser sample rate from `0` to `1` | `1`                  |

Enable both client-reporting switches together. In production the endpoint remains unavailable until
an edge/shared distributed rate limit is configured and `CLIENT_TELEMETRY_EDGE_RATE_LIMITED=true`.

## Loki/Grafana labels

Use only low-cardinality labels: `service`, `environment`, `level`, and optionally `component`.
Request IDs, paths, fingerprints, release IDs, and identities remain parsed JSON fields.

Retention, dashboards, alert thresholds, and incident ownership must be approved from measured
staging traffic before production rollout.
