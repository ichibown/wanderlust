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
