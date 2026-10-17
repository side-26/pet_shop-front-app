import { getSession } from '@/utils/session';
import { LOG_EVENTS } from '@/lib/logging/contracts';
import { parseClientErrorReport } from '@/lib/logging/client-report-schema';
import { serverLogger } from '@/lib/logging/server-logger';

const MAX_REPORT_BYTES = 8 * 1_024;

function emptyResponse(status: number): Response {
  return new Response(null, { status });
}

export async function POST(request: Request): Promise<Response> {
  if (process.env.CLIENT_ERROR_REPORTING_ENABLED !== 'true') return emptyResponse(404);
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.CLIENT_TELEMETRY_EDGE_RATE_LIMITED !== 'true'
  )
    return emptyResponse(503);

  const session = await getSession();
  if (!session) return emptyResponse(401);

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_REPORT_BYTES) return emptyResponse(413);

  let text: string;
  try {
    text = await request.text();
  } catch {
    return emptyResponse(400);
  }
  if (new TextEncoder().encode(text).byteLength > MAX_REPORT_BYTES) return emptyResponse(413);

  let report: ReturnType<typeof parseClientErrorReport>;
  try {
    report = parseClientErrorReport(JSON.parse(text) as unknown);
  } catch {
    report = null;
  }
  if (!report) {
    serverLogger.warn(
      {
        event: LOG_EVENTS.LOGGING_CLIENT_EVENT_REJECTED,
        component: 'client-telemetry',
        upstream: 'browser',
      },
      'Browser telemetry rejected',
    );
    return emptyResponse(400);
  }

  serverLogger.error(
    {
      event: LOG_EVENTS.CLIENT_UNEXPECTED_ERROR,
      component: 'client-telemetry',
      upstream: 'browser',
      request_id: report.request_id,
      error_type: report.error_type,
      error_fingerprint: report.error_fingerprint,
      interaction_type: report.interaction_type,
    },
    'Browser error reported',
  );

  return emptyResponse(202);
}
