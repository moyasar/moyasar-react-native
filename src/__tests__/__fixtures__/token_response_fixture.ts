import { TokenResponse } from '../../models/api/api_responses/token_response';

export const tokenResponseJsonFixture = {
  id: 'token',
  status: 'initiated',
  brand: 'mastercard',
  funding: 'credit',
  country: 'SA',
  month: '11',
  year: '2028',
  name: 'Mohammed Abdulaziz',
  last_four: '1111',
  metadata: { order_id: '67890' },
  message: 'message',
  verification_url: 'https://example.com/verify',
  created_at: '2023-08-23T12:12:55.857Z',
  updated_at: '2023-08-23T12:12:55.857Z',
  expires_at: '2023-08-23T12:27:55.857Z',
};

export const tokenResponseFixture = TokenResponse.fromJson(
  tokenResponseJsonFixture
);
