import { fetchStravaRefreshToken, getRedirectUrl } from "../utils/requests";
import { getStravaConfig, putStravaConfig } from "../utils/store";

/**
 * Handle Strava auth init.
 * Save clientId and clientSecret then redirect to Strava auth page.
 * 
 * @param {*} context 
 * @returns 
 */
export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (err) {
    return new Response('Failed to parse request body.', {
      status: 400
    });
  }
  if (!body.clientId || !body.clientSecret) {
    return new Response("Missing params: clientId, clientSecret.", {
      status: 400
    });
  }
  await putStravaConfig(context, body.clientId, body.clientSecret, '')
  return Response.json({ redirectUrl: getRedirectUrl(body.clientId, context.env.BASE_URL) });
}

/**
 * Handle Strava auth callback.
 * Get code and fetch refresh token then save it.
 * 
 * @param {*} context 
 * @returns 
 */
export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');
  if (!code) {
    return new Response("Missing param: code.", {
      status: 400
    });
  }
  const configJson = await getStravaConfig(context);
  if (configJson === null) {
    return new Response('Strava config not found, POST /strava/auth first.', {
      status: 428
    });
  }
  const refreshToken = await fetchStravaRefreshToken(configJson.clientId, configJson.clientSecret, code);
  if (!refreshToken || refreshToken === null) {
    return new Response('Failed to get Strava refresh token.', {
      status: 500
    });
  }
  await putStravaConfig(context, configJson.clientId, configJson.clientSecret, refreshToken);
  return Response.redirect(context.env.BASE_URL, 303);
}
