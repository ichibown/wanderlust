/**
 * Use cron polling worker to do Strava data sync.
 * 
 * TOOD: Use https://developers.strava.com/docs/webhooks/ in the future.
 */

const BASE_URL = "YOUR_BASE_URL"
const PASSWORD = "YOUR_PASSWORD"

export default {

  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      fetch(`${BASE_URL}/strava/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-password': PASSWORD,
        },
      }).then(response => response.text().then(text => console.log(text)))
    );
  },
};
