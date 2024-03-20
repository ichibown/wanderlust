/**
 * Called from frontend, redirect to Strava for auth.
 * 
 * @param {*} context 
 * @returns 
 */
export function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url)
  const clientId = searchParams.get('client_id')
  const clientSecret = searchParams.get('client_secret')
  // TODO: save to D1
  const redirectFunction = 'https://wanderlust.bown.run/strava/token'
  const redirectUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectFunction}&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write`
  return Response.redirect(redirectUrl, 301);
}
