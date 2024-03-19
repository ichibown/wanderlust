import fs from 'fs'
import path from 'path'
import { log } from 'console';
import open from 'open'
import readline from 'readline'
import axios from 'axios';
import stream from 'stream';
import util from 'util';

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

/**
 * Download activity FIT file and save to local.
 * 
 * @param {string} activityId 
 * @param {string} cookie get from browser developer console.
 */
async function downloadActivity(activityId, cookie) {
  const pipeline = util.promisify(stream.pipeline);
  const url = `https://www.strava.com/activities/${activityId}/export_original`;
  const response = await axios.get(url, {
    responseType: 'stream',
    headers: {
      'Cookie': cookie,
    },
  });

  await pipeline(response.data, fs.createWriteStream(`${activityId}.fit`));
}

/**
 * Create a .sql file and write activities to it.
 * 
 * @param {string} dstPath 
 * @param {*} activities 
 */
function writeToSqlFile(dstPath, activities) {
  fs.rmSync(dstPath, { force: true });
  const dir = path.dirname(dstPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const table = `
    CREATE TABLE IF NOT EXISTS activities ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, start_timestamp INTEGER, offset_timestamp INTEGER, elapsed_time INTEGER, moving_time INTEGER,
      distance REAL, avg_speed REAL, max_speed REAL,
      acc_elev REAL, max_elev REAL, min_elev REAL, 
      avg_heartrate REAL, max_heartrate REAL,
      latitude REAL, longitude REAL, country TEXT, polyline TEXT, 
      type TEXT, platform TEXT, platform_id TEXT
    );
  `
  fs.writeFileSync(dstPath, table);
  for (const activity of activities) {
    const insertQuery = `
    INSERT INTO activities (
      name, start_timestamp, offset_timestamp, elapsed_time, moving_time,
      distance, avg_speed, max_speed,
      acc_elev, max_elev, min_elev, 
      avg_heartrate, max_heartrate,
      latitude, longitude, country, polyline,
      type, platform, platform_id
    )
    VALUES (
      '${activity.name}', ${new Date(activity.start_date).getTime()}, ${activity.utc_offset}, ${activity.elapsed_time}, ${activity.moving_time},
      ${activity.distance}, ${activity.average_speed}, ${activity.max_speed},
      ${activity.total_elevation_gain || 0}, ${activity.elev_high || 0}, ${activity.elev_low || 0},
      ${activity.average_heartrate || 0}, ${activity.max_heartrate || 0},
      ${activity.start_latlng[0] || 0}, ${activity.start_latlng[1] || 0}, '${activity.location_country}', '${activity.map.summary_polyline}',
      '${activity.type}', 'strava', '${activity.upload_id_str}'
    );
    `;
    fs.appendFileSync(dstPath, insertQuery);
  }
}

async function main() {
  try {
    if (process.argv.length < 4) {
      log('Usage: node strava_importer.js <clientId> <clientSecret>')
      return
    }
    const clientId = process.argv[2];
    const clientSecret = process.argv[3];
    const refreshToken = await getRefreshToken(clientId, clientSecret)
    const authToken = await getAuthToken(clientId, clientSecret, refreshToken)
    const activities = await getActivities(authToken)
    writeToSqlFile('./tmp/strava_import.sql', activities)
    log('> npx wrangler d1 execute ${D1_DATABASE_NAME} --remote --file=tmp/strava_import.sql')
  } catch (error) {
    console.error(`Strava Import Error: ${error.message}`);
  }
}

main()
