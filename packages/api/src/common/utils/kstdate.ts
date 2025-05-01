export class KSTDate extends Date {
  private static readonly KST_OFFSET = 9 * 60 * 60 * 1000;

  constructor(date?: string | number | Date) {
    if (date) {
      super(date);
    } else {
      super(Date.now() + KSTDate.KST_OFFSET);
    }
  }

  static create(): KSTDate {
    return new KSTDate();
  }

  static fromDate(date: Date): KSTDate {
    return new KSTDate(date);
  }

  toISOString(): string {
    return super.toISOString();
  }

  toKSTString(): string {
    return this.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  }
}
