import { getStravaConfig, getUserConfig, putUserConfig } from "./utils/store";

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response('Bad request', { status: 400 });
  }
  await putUserConfig(context, body.name, body.motto, body.avatar);
  return new Response('Configs updated.');
}

export async function onRequestGet(context) {
  const stravaConfig = await getStravaConfig(context);
  const userConfig = await getUserConfig(context);
  return Response.json({
    userInfo: userConfig,
    hasStrava: stravaConfig !== null && stravaConfig.refreshToken !== null,
  });
}
