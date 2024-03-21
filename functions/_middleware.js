/**
 * Middleware for logging and error handling.
 * 
 * @param {*} context 
 * @returns 
 */
export async function onRequest(context) {
  try {
    console.log(context.request.method, context.request.url)
    return await context.next();
  } catch (err) {
    console.log(err.message, err.stack)
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}
