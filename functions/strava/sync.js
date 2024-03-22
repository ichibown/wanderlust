/**
 * sync strava activities.
 * 
 * @param {*} context 
 */
export async function onRequestGet(context) {
  const kv = context.env.KV
  return new Response('Hello')
}

async function fetchStravaActivities(accessToken, isInitial) {
  const result = []
  let page = 1
  let perPage = 100
  if (!isInitial) {
    perPage = 10
  }
  while (true) {
    const resp = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (resp.status == 200) {
      result.push(...resp.data)
    }
    if (!isInitial) {
      break
    }
    if (resp.data.length === perPage) {
      page++
    } else {
      break
    }
  }
  return result
}
