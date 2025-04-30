export class KSTDate extends Date {
  constructor() {
    const KSTOffset = 9 * 60 * 60 * 1000;

    super(Date.now() + KSTOffset);
  }
}
