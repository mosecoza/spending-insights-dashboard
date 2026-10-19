import { AxiosHeaders, type AxiosResponse } from 'axios';

// Build a minimal but fully-typed AxiosResponse for mocking api.get in tests.
// AxiosRequestHeaders is RawAxiosRequestHeaders & AxiosHeaders, so the config
// needs a real AxiosHeaders instance rather than a plain object.
export function createAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  };
}
