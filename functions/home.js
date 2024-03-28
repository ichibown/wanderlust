import { getActivities, getStravaConfig, getTimeConfig, getUserConfig } from "./utils/store";

export async function onRequestGet(context) {
  const timeConfig = await getTimeConfig(context);
  const lastSyncTime = timeConfig ? timeConfig.lastSyncTime : 'Never';
  if (context.request.headers['if-modified-since'] === lastSyncTime) {
    return new Response('Not Modified', { status: 304 });
  }
  const activities = await getActivities(context);
  const polylines = activities.map((activity) => ({
    platform: activity.platform,
    platformId: activity.platformId,
    polyline: activity.polyline,
  }));

  return Response.json({
    polylines: polylines,
  }, {
    headers: { 'Last-Modified': lastSyncTime },
  });
}
