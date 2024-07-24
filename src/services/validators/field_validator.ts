type Predicate = (value: string) => boolean;

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

  visualValidate(value: string): string | null {
    this.shouldErr = this.shouldErr || value !== '';
    if (!this.shouldErr) {
      return null;
    }

    return this.validate(value);
  }

  validate(value: string): string | null {
    for (const rule of this.rules) {
      if (rule.predicate(value)) {
        return rule.error;
      }
    }
    return null;
  }
}
