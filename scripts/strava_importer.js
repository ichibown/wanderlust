import fs from 'fs'
import { log } from 'console';
import open from 'open'
import readline from 'readline'
import axios from 'axios';

/**
 * Do Strava authentication, then return refresh token.
 * 
 * @param {string} clientId
 * @param {string} clientSecret
 */
async function getRefreshToken(clientId, clientSecret) {
  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read_all,profile:read_all,activity:read_all,profile:write,activity:write`
  await open(url)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const redirectUrl = await new Promise((resolve) => {
    rl.question('Click the [Authorize] button, copy the redirected URL and paste it below:', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
  if (!redirectUrl || redirectUrl.length === 0) {
    throw new Error('Auth failed, invalid URL.')
  }
  const code = redirectUrl.split('code=')[1].split('&')[0];
  if (!code || code.length === 0) {
    throw new Error('Auth failed, CODE not found.')
  }
  const resp = await axios.post('https://www.strava.com/oauth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code'
  });
  if (resp.status !== 200) {
    throw new Error(`Strava API error: ${resp.data}`);
  }
  return resp.data.refresh_token;
}

/**
 * Exchange auth token with refresh token.
 * 
 * @param {string} clientId 
 * @param {string} clientSecret 
 * @param {string} refreshToken 
 * @returns auth token.
 */
async function getAuthToken(clientId, clientSecret, refreshToken) {
  const resp = await axios.post('https://www.strava.com/oauth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  if (resp.status !== 200) {
    throw new Error(`Strava API error: ${resp.data}`);
  }

  return resp.data.access_token;
}

/**
 * Fetch Strava activities from all pages.
 * 
 * @param {string} accessToken 
 * @returns activities dict
 */
async function getActivities(accessToken) {
  const result = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const resp = await axios.get(`https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (resp.status !== 200) {
      throw new Error(`Strava API error: ${resp.data}`);
    }
    const activities = resp.data;
    log(`Got ${activities.length} activities on page ${page}`);
    result.push(...activities);
    if (activities.length === perPage) {
      page++;
    } else {
      break;
    }
  }
  return result;
}

async function main() {
  if (process.argv.length < 4) {
    log('Usage: node strava_importer.js <clientId> <clientSecret>')
    return
  }
  const clientId = process.argv[2];
  const clientSecret = process.argv[3];
  const refreshToken = await getRefreshToken(clientId, clientSecret)
  const authToken = await getAuthToken(clientId, clientSecret, refreshToken)
  const activities = await getActivities(authToken)
  log(`Got ${activities.length} activities.`)
  log(activities[0])
  /**
   * {
  resource_state: 2,
  athlete: { id: 123203107, resource_state: 1 },
  name: '傍晚行走',
  distance: 4579.2,
  moving_time: 3109,
  elapsed_time: 3162,
  total_elevation_gain: 107.4,
  type: 'Walk',
  sport_type: 'Walk',
  id: 10978007134,
  start_date: '2024-03-17T10:46:01Z',
  start_date_local: '2024-03-17T18:46:01Z',
  timezone: '(GMT+08:00) Asia/Shanghai',
  utc_offset: 28800,
  location_city: null,
  location_state: null,
  location_country: 'China',
  achievement_count: 0,
  kudos_count: 0,
  comment_count: 0,
  athlete_count: 1,
  photo_count: 0,
  map: {
    id: 'a10978007134',
    summary_polyline: 'c`{rFws~eU~@zALJVB~@Ez@OdAKdASfEm@~@B`AC~@?J@NF^^FZ@n@CnB?~DD`C@\\FVPTPJVBp@Cb@@ND^T`@PV^B\\DTDDHBlBITELIJSF[?QGg@T_@P\\JJPHTDp@ID@|@j@PDZBv@EOa@Eo@D_@FKJCj@@v@GZBBNGj@?XHPJBTCl@Y`@GJIDM@SESQc@DE`AHh@JHFFP?NCJC?AEBWHWHIPEt@Bj@ILGdA}@JCNAHIFQ?GSu@Ac@@UNs@Bg@BKDADDNd@f@r@TPNFL@JKFWHm@Ak@Mu@GKUUE[QKWEWH[Ti@j@KPKb@MZg@n@[XCJARB|@NpA@\\CRK\\Gx@INKDg@?gABoA^cAI}@FKEGQG}@CQGIMAg@Ho@FUHIPYnAIHMDO?QEe@SOEaACcAUsFNUE_@QMEoA?_@Ia@Ye@i@GMC]HoCIkBA{EEc@GQKKMGSCwBB_AD{@PyDb@qBXiAV[BGCIIIe@Ai@JgAGe@MSOGQ@YPGHAJ@LDHHDX?^P',
    resource_state: 2
  },
  trainer: false,
  commute: false,
  manual: false,
  private: false,
  visibility: 'followers_only',
  flagged: false,
  gear_id: null,
  start_latlng: [ 39.956665271893144, 116.48844799026847 ],
  end_latlng: [ 39.9564516171813, 116.48869433440268 ],
  average_speed: 1.473,
  max_speed: 3.008,
  has_heartrate: true,
  average_heartrate: 104.8,
  max_heartrate: 119,
  heartrate_opt_out: false,
  display_hide_heartrate_option: true,
  elev_high: 69.8,
  elev_low: 30.4,
  upload_id: 11736749142,
  upload_id_str: '11736749142',
  external_id: '3A397BF9-860F-4C3B-914D-54ED06F98DB4.fit',
  from_accepted_tag: false,
  pr_count: 0,
  total_photo_count: 0,
  has_kudoed: false
}
*/
}

main()
