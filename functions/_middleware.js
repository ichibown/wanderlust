const postPathsToAuth = [
  '/strava/auth',
  '/strava/sync',
  '/config'
];

function authentication(context) {
  const path = new Url(context.request.url).pathname;
  if (context.request.method === "POST" && postPathsToAuth.includes(path)) {
    if (context.request.headers.get("x-password") != context.env.PASSWORD) {
      return new Response("Unauthorized", { status: 403 });
    }
  }
  return context.next();
}

async function errorHandling(context) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}

export const onRequest = [errorHandling, authentication];
