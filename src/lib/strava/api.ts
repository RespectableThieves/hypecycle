import { BACKEND, STRAVA_BACKEND } from '../../constants';
import { RideModel } from '../../database';

export type Athlete = {
  id: number;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sex: string | null;
  premium: boolean;
  summit: boolean;
  updated_at: string;
  created_at: string;
  weight: number | null;
  profile_medium: string;
  profile: string;
  // Note sure what these fields
  // are used for yet.
  friend: unknown | null;
  follower: unknown | null;
};

export type Token = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: Athlete;
};

// same as token but without Athlete
export type RefreshToken = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
};

async function getToken<T>(
  type: 'auth' | 'refresh',
  params: { code: string } | { refreshToken: Token['refresh_token'] },
): Promise<T> {
  const res = await fetch(`${BACKEND}/${type}`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(`token ${type} fail`, data.data);
    throw Error(data.message);
  } else {
    console.log(`token ${type} success`);
  }

  return data;
}

export async function authorize({ code }: { code: string }): Promise<Token> {
  return getToken<Token>('auth', { code });
}

export async function refreshToken(
  t: Token['refresh_token'],
): Promise<RefreshToken> {
  // fresh will
  return getToken<RefreshToken>('refresh', { refreshToken: t });
}


type StravaUpload = {
  id_str: string
  activity_id: number
  external_id: string
  id: number
  error: string | null
  status: string
}

export async function upload(t: Token, ride: RideModel, fileURI: string): Promise<StravaUpload> {
  const name = 'hypecycle test ride'
  const formData = new FormData();
  formData.append('file', { uri: fileURI, name, type: 'application/vnd.garmin.tcx+xml' });
  formData.append('external_id', ride.id);

  const res = await fetch(`${STRAVA_BACKEND}/uploads`, {
    body: formData,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${t.access_token}`
    },
  });

  if (!res.ok) {
    throw Error(`Failed to upload file to strava ${fileURI}`)
  }

  const data = await res.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
