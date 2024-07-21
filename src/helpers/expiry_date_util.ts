export class ExpiryDateUtil {
  month: number;
  year: number;

  constructor(month: number, year: number) {
    this.month = month;
    this.year = year;
  }

  private dateInstance(): Date | null {
    if (!this.isValid()) {
      return null;
    }

    return new Date(this.year, this.month - 1);
  }

  isValid(): boolean {
    return this.month >= 1 && this.month <= 12 && this.year > 1900;
  }

  isExpired(): boolean {
    const expiry = this.dateInstance();
    if (!expiry) {
      return false;
    }

    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth());
    return expiry < currentDate;
  }

  static fromPattern(pattern: string): ExpiryDateUtil | null {
    const clean = pattern.replace(/[\s\/]/g, '');

    if (clean.length === 4) {
      // TODO: Optimize to init the Date object once for this class

      const millennium = Math.floor(new Date().getFullYear() / 100) * 100;
      const year = parseInt(clean.substring(2, 4), 10);

      return new ExpiryDateUtil(
        parseInt(clean.substring(0, 2), 10),
        year + millennium
      );
    } else if (clean.length === 6) {
      return new ExpiryDateUtil(
        parseInt(clean.substring(0, 2), 10),
        parseInt(clean.substring(2, 6), 10)
      );
    } else {
      return null;
    }
  }
}
