const defaultUserConfig = {
  name: 'Wanderluster',
  motto: 'Better to run than curse the road.',
  avatar: '/avatar.jpg',
};

export async function putUserConfig(context, name, motto, avatar) {
  return await context.env.KV.put('config:user', JSON.stringify({
    name: name,
    motto: motto,
    avatar: avatar,
  }));
}

export async function getUserConfig(context) {
  const userConfig = await context.env.KV.get('config:user', { type: 'json' });
  return userConfig || defaultUserConfig;
}

export async function putStravaConfig(context, clientId, clientSecret, refreshToken) {
  return await context.env.KV.put('config:strava', JSON.stringify({
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
  }));
}

export async function getStravaConfig(context) {
  return await context.env.KV.get('config:strava', { type: 'json' });
}

export async function hasActivities(context) {
  const activityKeys = await context.env.KV.list({ prefix: 'activities:' });
  return activityKeys.keys.length > 0;
}

export async function getActivitiesMap(context) {
  const result = new Map();
  const activityKeys = await context.env.KV.list({ prefix: 'activities:' });
  for (const key of activityKeys.keys) {
    const activitiesByKey = await kv.get(key.name, { type: 'json' });
    result.set(key.name, activitiesByKey);
  }
  return result;
}

export async function putActivities(context, rawActivities) {
  const activitiesMap = await getActivitiesMap(context);
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
  return newActivitiesCount;
}
