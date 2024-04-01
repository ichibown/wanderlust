import { getActivities, getTimeConfig } from "./utils/store";

export async function onRequestGet(context) {
  const timeConfig = await getTimeConfig(context);
  const lastSyncTime = timeConfig ? timeConfig.lastSyncTime : 'Never';
  if (context.request.headers.get("if-modified-since") == lastSyncTime) {
    return new Response({ status: 304 });
  }
  const activities = await getActivities(context);
  const polylines = activities.map((activity) => ({
    key: activity.platform + activity.platformId,
    desc: `${activity.name ?? activity.type} ${(activity.distance / 1000).toFixed(2)}km\n${new Date(activity.startTimestamp + activity.offsetTimestamp).toISOString().split('T')[0]}`,
    polyline: activity.polyline,
  }));

  return Response.json({
    polylines: polylines,
  }, {
    headers: { 'Last-Modified': lastSyncTime },
  });
}
