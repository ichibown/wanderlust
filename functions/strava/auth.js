function getRedirectUrl(clientId, baseUrl) {
  return 'https://www.strava.com/oauth/authorize' +
    `?client_id=${clientId}` +
    '&response_type=code' +
    `&redirect_uri=${baseUrl}/strava/auth` +
    '&approval_prompt=force' +
    '&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write';
}

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
  await context.env.KV.put('config:strava', JSON.stringify({
    clientId: body.clientId,
    clientSecret: body.clientSecret
  }));
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
  const kv = context.env.KV;
  if (!code) {
    return new Response("Missing param: code.", {
      status: 400
    });
  }
  const configJson = await kv.get('config:strava', { type: 'json' });
  if (configJson === null) {
    return new Response('Strava config not found, POST /strava/auth first.', {
      status: 428
    });
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
  });
  if (!resp.ok) {
    return new Response('Failed to get Strava refresh token.', {
      status: 500
    });
  }
  const data = await resp.json();
  await kv.put('config:strava', JSON.stringify({
    clientId: configJson.clientId,
    clientSecret: configJson.clientSecret,
    refreshToken: data.refresh_token,
  }));
  return Response.redirect(context.env.BASE_URL, 303);
}
