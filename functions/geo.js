import { getActivities } from "./utils/store";

export async function onRequestGet(context) {
  const activities = await getActivities(context);
  const polylines = activities.map((activity) => ({
    platform: activity.platform,
    platformId: activity.platformId,
    polyline: activity.polyline,
  }));
  return Response.json({
    polylines: polylines,
  });
}
