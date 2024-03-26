export function postStravaAuth(clientId, clientSecret, password) {
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
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to post strava auth code');
    }
    return response.json();
  });
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
  }).then(response => {
    onResult(response.ok);
  });
}
