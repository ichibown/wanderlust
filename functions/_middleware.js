/**
 * Middleware for logging and error handling.
 * 
 * @param {*} context 
 * @returns 
 */
export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}
