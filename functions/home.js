const defaultUserConfig = {
  name: 'Wanderluster',
  motto: 'Better to run than curse the road.',
  avatar: '/avatar.jpg',
};

export async function onRequestGet(context) {
  const userConfig = await context.env.KV.get('config:user', { type: 'json' });
  const stravaConfig = await context.env.KV.get('config:strava', { type: 'json' });
  return Response.json({
    userInfo: userConfig || defaultUserConfig,
    hasStrava: stravaConfig !== null && stravaConfig.refreshToken !== null,
    activities: [],
  });
}
