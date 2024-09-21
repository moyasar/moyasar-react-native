type Predicate = (
  value: string,
  creditCardNumber: string | undefined
) => boolean;

interface ValidationRule {
  predicate: Predicate;
  error: string;
}

export class FieldValidator {
  private rules: ValidationRule[] = [];
  private shouldErr: boolean = false;

  addRule(error: string, predicate: Predicate): void {
    this.rules.push({ predicate, error });
  }

  visualValidate(value: string, creditCardNumber?: string): string | null {
    this.shouldErr = this.shouldErr || value !== '';
    if (!this.shouldErr) {
      return null;
    }

    return this.validate(value, creditCardNumber);
  }

  validate(value: string, creditCardNumber?: string): string | null {
    for (const rule of this.rules) {
      if (rule.predicate(value, creditCardNumber)) {
        return rule.error;
      }
    }
    return null;
  }
}
