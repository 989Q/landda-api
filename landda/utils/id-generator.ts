export function generateUniqueId() {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789";
  const segmentLengths = [6, 4, 4];
  
  for (let i = 0; i < segmentLengths.length; i++) {
    for (let j = 0; j < segmentLengths[i]; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    if (i < segmentLengths.length - 1) {
      result += "-";
    }
  }
  
  return result;
}

// ____________________________________

export function generateUniqueUserId() {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789";
  const segmentLengths = [4, 4, 4];
  
  for (let i = 0; i < segmentLengths.length; i++) {
    for (let j = 0; j < segmentLengths[i]; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    if (i < segmentLengths.length - 1) {
      result += "-";
    }
  }
  
  return result;
}