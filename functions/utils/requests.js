export function getRedirectUrl(clientId, baseUrl) {
  return 'https://www.strava.com/oauth/authorize' +
    `?client_id=${clientId}` +
    '&response_type=code' +
    `&redirect_uri=${baseUrl}/strava/auth` +
    '&approval_prompt=force' +
    '&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write';
}

export async function fetchStravaRefreshToken(clientId, clientSecret, code) {
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code'
    })
  });
  if (resp.ok) {
    return (await resp.json()).refresh_token;
  } else {
    return null;
  }
}

export async function fetchStravaActivities(accessToken, isInitial) {
  const result = [];
  let page = 1;
  let perPage = 100;
  if (!isInitial) {
    perPage = 10;
  }
  while (true) {
    const resp = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!resp.ok) {
      console.log(`Fetch activities error: ${resp.status}`);
      break;
    }
    const data = await resp.json();
    console.log(`Got ${data.length} activities on page ${page}`);
    result.push(...data);
    if (!isInitial) {
      break;
    }
    if (data.length === perPage) {
      page++;
    } else {
      break;
    }
  }
  return result;
}

export async function fetchStravaAccessToken(clientId, clientSecret, refreshToken) {
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  });
  if (resp.ok) {
    return (await resp.json()).access_token;
  } else {
    return null;
  }
}
