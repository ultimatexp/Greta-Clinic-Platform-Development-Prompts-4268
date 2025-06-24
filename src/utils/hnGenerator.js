// Hospital Number (HN) Generator with duplicate prevention
export class HNGenerator {
  static generateHN() {
    // Generate HN in format: HN + 6 digits (e.g., HN000001)
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const hn = `HN${String(timestamp).slice(-4)}${String(random).padStart(2, '0')}`;
    return hn;
  }

  static validateUniqueHN(hn, existingPatients) {
    return !existingPatients.some(patient => patient.hn === hn);
  }

  static generateUniqueHN(existingPatients) {
    let hn;
    let attempts = 0;
    do {
      hn = this.generateHN();
      attempts++;
    } while (!this.validateUniqueHN(hn, existingPatients) && attempts < 100);
    
    return hn;
  }
}