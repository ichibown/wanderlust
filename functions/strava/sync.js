import { fetchStravaAccessToken, fetchStravaActivities } from "../utils/requests";
import { putActivities, getStravaConfig, hasActivities, putTimeConfig } from "../utils/store";

/**
 * sync strava activities.
 * 
 * @param {*} context 
 */
export async function onRequestPost(context) {
  let configJson = await getStravaConfig(context);
  if (configJson === null || !configJson.refreshToken || configJson.refreshToken === '') {
    return new Response('Strava config not found, POST /strava/auth first.', {
      status: 428
    });
  }
  const accessToken = await fetchStravaAccessToken(configJson.clientId, configJson.clientSecret, configJson.refreshToken);
  if (!accessToken || accessToken === null) {
    return new Response('Failed to get Strava access token.', {
      status: 500
    });
  }
  const hasSynced = await hasActivities(context);
  const rawActivities = await fetchStravaActivities(accessToken, !hasSynced);
  const newActivitiesCount = await putActivities(context, rawActivities);
  if (newActivitiesCount > 0) {
    await putTimeConfig(context, new Date().toUTCString());
  }
  return new Response(`Synced ${newActivitiesCount} new activities.`);
}
