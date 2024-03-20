/**
 * Redirect from Strava OAuth, with code.
 * 
 * @param {*} context 
 * @returns 
 */
export function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url)
  const code = searchParams.get('code')
  // TODO: get refresh token from Strava and save to D1
  return Response.json({
    code: code
  })
}
