// This is the backend script to handle strava token exchange.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname == '/auth') {
        return await authenticate(request, env);
      }

      if (url.pathname == '/refresh') {
        return await refresh(request, env);
      }
    } catch (e) {
      return new Response(e.message, {
        status: 500,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
      });
    }

    return new Response('Not found', {status: 404});
  },
};

async function authenticate(request, env) {
  const {code} = await request.json();
  const res = await getToken(
    env.STRAVA_CLIENT_ID,
    env.STRAVA_CLIENT_SECRET,
    'authorization_code',
    {code: code},
  );

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

async function refresh(request, env) {
  const {refreshToken} = await request.json();
  const res = await getToken(
    env.STRAVA_CLIENT_ID,
    env.STRAVA_CLIENT_SECRET,
    'refresh_token',
    {refresh_token: refreshToken},
  );

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

async function getToken(client_id, client_secret, grant_type, params) {
  const body = new URLSearchParams({
    grant_type,
    client_id,
    client_secret,
    ...params,
  });

  console.log({body: body.toString()});

  const payload = {
    body: body,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  };

  const response = await fetch(
    'https://www.strava.com/api/v3/oauth/token',
    payload,
  );
  const data = await response.json();

  if (!response.ok) {
    throw Error(JSON.stringify({message: 'Failed to fetch token', data}));
  }

  return data;
}
