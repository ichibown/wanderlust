/**
 * strava config SQL schemas
 */
const sqlCreateConfigTable = "CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)"
const sqlCreateStravaConfig = "INSERT INTO config (key, value) VALUES ('strava', ?1)"
const sqlReadStravaConfig = "SELECT * FROM config WHERE key = 'strava'"
const sqlUpdateStravaConfig = "UPDATE config SET value = ?1 WHERE key = 'strava'"
const sqlDeleteStravaConfig = "DELETE FROM config WHERE key = 'strava'"

// TODO: baseUrl from ENV.
const baseUrl = 'https://wanderlust.bown.run'
// const baseUrl = 'http://localhost:8788'
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
  const db = context.env.WANDERLUST
  if (clientId && clientSecret) {
    return await handleStravaInit(db, clientId, clientSecret)
  } else if (code) {
    return await handleStravaAuth(db, code)
  } else {
    return new Response("Missing params.", {
      status: 422
    })
  }
}

async function handleStravaInit(db, clientId, clientSecret) {
  const configJson = JSON.stringify({
    clientId: clientId,
    clientSecret: clientSecret
  })
  db.batch([
    db.prepare(sqlCreateConfigTable),
    db.prepare(sqlDeleteStravaConfig),
    db.prepare(sqlCreateStravaConfig).bind(configJson),
  ])
  return Response.redirect(redirectUrlPrefix + clientId + redirectUriSuffix, 301);
}

async function handleStravaAuth(db, code) {
  const stravaConfig = await getStravaConfig(db)
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: stravaConfig.clientId,
      client_secret: stravaConfig.clientSecret,
      code: code,
      grant_type: 'authorization_code'
    })
  })
  const data = await resp.json()
  await updateStravaConfig(db, stravaConfig.clientId, stravaConfig.clientSecret, data.refresh_token)
  return new Response('Strava auth success')
}

async function getStravaConfig(db) {
  const stravaConfigJson = await db.prepare(sqlReadStravaConfig).first('value')
  const stravaConfig = JSON.parse(stravaConfigJson)
  return stravaConfig
}

async function updateStravaConfig(db, clientId, clientSecret, refreshToken) {
  await db.prepare(sqlUpdateStravaConfig).bind(JSON.stringify({
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
  })).run()
}
