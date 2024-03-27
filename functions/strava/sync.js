async function getStravaAccessToken(clientId, clientSecret, refreshToken) {
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
    console.log(`Get access token error: ${resp.status}`);
    return null;
  }
}

async function getActivitiesMap(kv) {
  const result = new Map();
  const activityKeys = await kv.list({
    prefix: 'activities:',
  });
  for (const key of activityKeys.keys) {
    const activitiesByKey = await kv.get(key.name, { type: 'json' });
    result.set(key.name, activitiesByKey);
  }
  return result;
}

async function fetchStravaActivities(accessToken, isInitial) {
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

async function mergeAndSaveActivities(kv, activitiesMap, rawActivities) {
  const newActivities = rawActivities.map(activity => ({
    name: activity.name,
    startTimestamp: new Date(activity.start_date).getTime(),
    offsetTimestamp: activity.utc_offset,
    elapsedTime: activity.elapsed_time,
    movingTime: activity.moving_time,
    distance: activity.distance,
    avgSpeed: activity.average_speed,
    maxSpeed: activity.max_speed,
    accEle: activity.total_elevation_gain || 0,
    maxEle: activity.elev_high || 0,
    minEle: activity.elev_low || 0,
    avgHr: activity.average_heartrate || 0,
    maxHr: activity.max_heartrate || 0,
    location: {
      lat: activity.start_latlng[0] || 0,
      lng: activity.start_latlng[1] || 0,
    },
    country: activity.location_country,
    polyline: activity.map.summary_polyline,
    type: activity.type,
    platform: 'strava',
    platformId: activity.upload_id_str,
  }));

  let newActivitiesCount = 0;
  const modifiedKeys = [];
  for (const activity of newActivities) {
    const type = activity.type;
    const year = new Date(activity.startTimestamp + activity.offsetTimestamp).getFullYear();
    const key = `activities:${type}:${year}`;
    if (!activitiesMap.has(key)) {
      activitiesMap.set(key, [activity]);
      newActivitiesCount++;
      modifiedKeys.push(key);
    } else {
      const existingActivities = activitiesMap.get(key);
      if (!existingActivities.some(a => a.startTimestamp === activity.startTimestamp)) {
        existingActivities.push(activity);
        newActivitiesCount++;
        modifiedKeys.push(key);
      }
    }
  }
  for (const [key, activities] of activitiesMap.entries()) {
    if (modifiedKeys.includes(key)) {
      await kv.put(key, JSON.stringify(activities));
    }
  }
  console.log(`Saved ${newActivitiesCount} new activities.`);
  return newActivitiesCount;
}

/**
 * sync strava activities.
 * 
 * @param {*} context 
 */
export async function onRequestPost(context) {
  const kv = context.env.KV;
  let configJson = await kv.get('config:strava', { type: 'json' });
  if (configJson === null || !configJson.refreshToken || configJson.refreshToken === '') {
    return new Response('Strava config not found, POST /strava/auth first.', {
      status: 428
    });
  }
  const accessToken = await getStravaAccessToken(configJson.clientId, configJson.clientSecret, configJson.refreshToken);
  if (!accessToken || accessToken === null) {
    return new Response('Failed to get Strava access token.', {
      status: 500
    });
  }
  const activitiesMap = await getActivitiesMap(kv);
  const rawActivities = await fetchStravaActivities(accessToken, activitiesMap.size === 0);
  const newActivitiesCount = await mergeAndSaveActivities(kv, activitiesMap, rawActivities);
  return new Response(`Synced ${newActivitiesCount} new activities.`);
}
