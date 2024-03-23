const defaultConfig = {
  name: 'Wanderluster',
  motto: 'Better to run than curse the road.',
  avatar: '/avatar.jpg',
};

export async function onRequestGet(context) {
  const userConfig = await context.env.KV.get('config:user', { type: 'json' });
  const stravaConfig = await context.env.KV.get('config:strava', { type: 'json' });
  return Response.json({
    userInfo: userConfig || defaultConfig,
    isStravaConfigured: stravaConfig !== null && stravaConfig.refreshToken !== null,
  });
}

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response('Bad request', { status: 400 });
  }
  await context.env.KV.put('config:user', JSON.stringify({
    name: body.name || defaultConfig.name,
    motto: body.motto || defaultConfig.motto,
    avatar: body.avatar || defaultConfig.avatar,
  }));
  return new Response('Configs updated.');
}
