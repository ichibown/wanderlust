import { getActivities, getStravaConfig, getUserConfig } from "./utils/store";

const supportedTypes = ['Run', 'Ride', 'Hike', 'Walk'];

export async function onRequestGet(context) {
  const userConfig = await getUserConfig(context);
  const stravaConfig = await getStravaConfig(context);
  const activities = await getActivities(context);
  const polylines = activities.filter((activity) => supportedTypes.includes(activity.type)).map((activity) => activity.polyline);

  return Response.json({
    userInfo: userConfig,
    hasStrava: stravaConfig !== null && stravaConfig.refreshToken !== null,
    polylines: polylines,
  });
}
