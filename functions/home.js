import { getStravaConfig, getUserConfig } from "./utils/store";

export async function onRequestGet(context) {
  const userConfig = await getUserConfig(context);
  const stravaConfig = await getStravaConfig(context);

  return Response.json({
    userInfo: userConfig,
    hasStrava: stravaConfig !== null && stravaConfig.refreshToken !== null,
  });
}
