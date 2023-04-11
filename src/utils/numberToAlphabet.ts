export function numberToAlphabet(n: number) {
    // Handle cases where n is not a positive integer
    if (!Number.isInteger(n) || n <= 0) {
      return "Invalid input";
    }
  
    let result = "";
    while (n > 0) {
      const remainder = (n - 1) % 26; // Calculate remainder
      result = String.fromCharCode(65 + remainder) + result; // Add alphabet to result
      n = Math.floor((n - 1) / 26); // Update n for next iteration
    }
  
    return result;
  }