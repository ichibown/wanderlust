// TODO: baseUrl from ENV.
// const baseUrl = 'http://localhost:8788'
const baseUrl = 'https://wanderlust.bown.run'
const redirectUrlPrefix = `https://www.strava.com/oauth/authorize?client_id=`
const redirectUriSuffix = `&response_type=code&redirect_uri=${baseUrl}/strava/auth&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write`

/**
 * Called from frontend, redirect to Strava for auth, then redirect back to get code.
 * 
 * @param {*} context 
 * @returns 
 */
export async function onRequestGet(context) {
  const { searchParams } = new URL(context.request.url)
  const clientId = searchParams.get('client_id')
  const clientSecret = searchParams.get('client_secret')
  const code = searchParams.get('code')
  const kv = context.env.KV
  if (clientId && clientSecret) {
    return await handleStravaInit(kv, clientId, clientSecret)
  } else if (code) {
    return await handleStravaAuth(kv, code)
  } else {
    return new Response("Missing params.", {
      status: 422
    })
  }
}

async function handleStravaInit(kv, clientId, clientSecret) {
  const configText = JSON.stringify({
    clientId: clientId,
    clientSecret: clientSecret
  })
  await kv.put('config:strava', configText)
  return Response.redirect(redirectUrlPrefix + clientId + redirectUriSuffix, 301);
}

async function handleStravaAuth(kv, code) {
  const configJson = await kv.get('config:strava', { type: 'json' })
  if (configJson === null) {
    return new Response('Strava config not found', {
      status: 404
    })
  }
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: configJson.clientId,
      client_secret: configJson.clientSecret,
      code: code,
      grant_type: 'authorization_code'
    })
  })
  const data = await resp.json()
  await kv.put('config:strava', JSON.stringify({
    clientId: configJson.clientId,
    clientSecret: configJson.clientSecret,
    refreshToken: data.refresh_token,
  }))
  return new Response('Strava auth success')
}
