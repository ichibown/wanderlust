import { putUserConfig } from "./utils/store";

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response('Bad request', { status: 400 });
  }
  await putUserConfig(context, body.name, body.motto, body.avatar);
  return new Response('Configs updated.');
}
