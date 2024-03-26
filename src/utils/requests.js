export function postStravaAuth(clientId, clientSecret, password, onResult) {
  return fetch('/strava/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-password': password,
    },
    body: JSON.stringify({
      clientId: clientId,
      clientSecret: clientSecret,
    }),
  })
    .then(response => {
      if (response.status === 301) {
        // Redirect to Strava OAuth
        window.location = response.headers.get('Location');
      } else {
        return response.text().then(text => onResult(text));
      }
    });
}

export function postStravaSync(password, onResult) {
  return fetch('/strava/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-password': password,
    },
  })
    .then(response => response.text().then(text => onResult(text)));
}

export function postUserConfig(avatar, name, motto, password, onResult) {
  return fetch('/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-password': password,
    },
    body: JSON.stringify({
      avatar: avatar,
      name: name,
      motto: motto,
    }),
  }).then(response => response.text().then(text => onResult(text)));
}


export function getHomeData(onResult) {
  return fetch('/home')
    .then(response => response.json().then(json => onResult(json)));
}
