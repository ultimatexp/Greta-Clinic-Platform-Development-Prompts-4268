// Duplicate name detection utility
export class DuplicateDetector {
  static findSimilarNames(newPatient, existingPatients) {
    const similar = [];
    const newFullName = `${newPatient.firstName} ${newPatient.lastName}`.toLowerCase();
    
    existingPatients.forEach(patient => {
      const existingFullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      
      // Exact name match
      if (existingFullName === newFullName) {
        similar.push({
          ...patient,
          matchType: 'exact',
          similarity: 100
        });
      }
      // Similar name (Levenshtein distance)
      else if (this.calculateSimilarity(newFullName, existingFullName) > 85) {
        similar.push({
          ...patient,
          matchType: 'similar',
          similarity: this.calculateSimilarity(newFullName, existingFullName)
        });
      }
    });
    
    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  static calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - editDistance) / longer.length) * 100);
  }

  static levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}