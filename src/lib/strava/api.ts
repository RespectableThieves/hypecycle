import Constants from '../../constants';
import {RideModel} from '../../database';
import * as FileSystem from 'expo-file-system';

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
  params: {code: string} | {refreshToken: Token['refresh_token']},
): Promise<T> {
  const res = await fetch(`${Constants.backend}/${type}`, {
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

export async function authorize({code}: {code: string}): Promise<Token> {
  return getToken<Token>('auth', {code});
}

export async function refreshToken(
  t: Token['refresh_token'],
): Promise<RefreshToken> {
  // fresh will
  return getToken<RefreshToken>('refresh', {refreshToken: t});
}

type StravaUpload = {
  id: number;
  id_str: string;
  activity_id: number | null;
  external_id: string;
  error: string | null;
  status: string;
};

export async function getUpload(id: number, t: Token): Promise<StravaUpload> {
  // TODO pass in token
  // strava processes uploads async so we want to wait
  // until we
  const res = await fetch(`${Constants.stravaBackend}/uploads/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${t.access_token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.message);
  }

  return data;
}

export async function upload(
  t: Token,
  rideId: RideModel['id'],
  fileURI: string,
): Promise<StravaUpload> {
  /// example response: {"data": {"body": "{\"id\":9482535552,\"id_str\":\"9482535552\",\"external_id\":\"stripped_health_data_100877106_1680703881.gpx\",\"error\":null,\"status\":\"Your activity is still being processed.\",\"activity_id\":null}", "headers": {"cache-control": "max-age=0, private, must-revalidate", "content-type": "application/json; charset=utf-8", "date": "Wed, 05 Apr 2023 14:11:22 GMT", "etag": "W/\"7a1bad1d9f549f028357850b6d844dd6\"", "referrer-policy": "strict-origin-when-cross-origin", "server": "nginx/1.21.3", "status": "201 Created", "vary": "Origin", "via": "1.1 linkerd, 1.1 linkerd, 1.1 dccf8b56c5bf22bc5b8eac27ffbf7758.cloudfront.net (CloudFront)", "x-amz-cf-id": "vUWkjUVTl1-81EVZLNL8MoHBKCEixkdxwv165NkOIa6E4HtaoAVk_A==", "x-amz-cf-pop": "ATL59-P3", "x-cache": "Miss from cloudfront", "x-content-type-options": "nosniff", "x-download-options": "noopen", "x-frame-options": "DENY", "x-permitted-cross-domain-policies": "none", "x-ratelimit-limit": "200,2000", "x-ratelimit-usage": "2,2", "x-request-id": "7f29f9a3-415e-411d-bf9e-d82ce1237e50", "x-xss-protection": "1; mode=block"}, "status": 201}}

  const res = await FileSystem.uploadAsync(
    Constants.stravaBackend + '/uploads',
    fileURI,
    {
      headers: {
        Authorization: `Bearer ${t.access_token}`,
      },
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: 'application/vnd.garmin.tcx+xml',
      parameters: {
        data_type: 'tcx',
        external_id: `hypecycle-${rideId}`,
      },
    },
  );

  const data = JSON.parse(res.body);

  // error occurred
  if (data.message) {
    throw Error(data.message);
  }

  // strava gives us a upload ID back
  // once it's finished processing
  // we can call https://developers.strava.com/docs/reference/#api-Uploads-getUploadById
  // to get the ActivityId
  return data;
}
