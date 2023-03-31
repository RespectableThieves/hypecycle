import {BACKEND} from '../../constants';

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

export async function authorize(params: any): Promise<Token> {
  const res = await fetch(`${BACKEND}/auth`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log('Authorization fail', data.data);
    throw Error(data.message);
  } else {
    console.log('Authorization success');
  }

  return data;
}

export async function refresh(
  refreshToken: Token['refresh_token'],
): Promise<Token> {
  const res = await fetch(`${BACKEND}/refresh`, {
    body: JSON.stringify({refreshToken}),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log('Authorization fail', data.data);
    throw Error(data.message);
  } else {
    console.log('Authorization success');
  }

  return data;
}
