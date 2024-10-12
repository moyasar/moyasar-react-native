/**
 Moyasar API response for processing a token request.
 */
export class TokenResponse {
  id: string;
  status: string;
  brand: string;
  funding: string;
  country: string;
  month: string;
  year: string;
  name: string;
  lastFour: string;
  metadata?: Record<string, string> | null;
  message?: string | null;
  verificationUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;

  constructor({
    id,
    status,
    brand,
    funding,
    country,
    month,
    year,
    name,
    lastFour,
    metadata,
    message,
    verificationUrl,
    createdAt,
    updatedAt,
    expiresAt,
  }: {
    id: string;
    status: string;
    brand: string;
    funding: string;
    country: string;
    month: string;
    year: string;
    name: string;
    lastFour: string;
    metadata?: Record<string, string>;
    message?: string;
    verificationUrl?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
  }) {
    this.id = id;
    this.status = status;
    this.brand = brand;
    this.funding = funding;
    this.country = country;
    this.month = month;
    this.year = year;
    this.name = name;
    this.lastFour = lastFour;
    this.metadata = metadata;
    this.message = message;
    this.verificationUrl = verificationUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.expiresAt = expiresAt;
  }

  /**
   * Creates a new TokenResponse instance from a JSON object.
   */
  static fromJson(json: Record<string, any>): TokenResponse {
    return new TokenResponse({
      id: json.id,
      status: json.status,
      brand: json.brand,
      funding: json.funding,
      country: json.country,
      month: json.month,
      year: json.year,
      name: json.name,
      lastFour: json.last_four,
      metadata: json.metadata,
      message: json.message,
      verificationUrl: json.verification_url,
      createdAt: json.created_at,
      updatedAt: json.updated_at,
      expiresAt: json.expires_at,
    });
  }
}
