// generateID.ts

function getRandomCharacter(characters: string) {
  return characters[Math.floor(Math.random() * characters.length)];
}

function generateRandomString(length: number, probability: number) {
  let result = '';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.random();
    if (randomNumber <= probability) {
      result += getRandomCharacter(numbers);
    } else {
      result += getRandomCharacter(letters);
    }
  }
  return result;
}

// ________________________________________ User ID

export function generateUserID() {
  const set1 = generateRandomString(10, 0.8);
  return `user-${set1}`;
}

export function generateUserID2() {
  const set1 = generateRandomString(14, 0.6);
  return `user-${set1}`;
}

// ________________________________________ List ID

export function generatePostID() {
  const set1 = generateRandomString(4, 0.8);
  const set2 = generateRandomString(4, 0.8);
  const set3 = generateRandomString(4, 0.8);

  return `list-${set1}${set2}${set3}`;
}

export function generatePostID2() {
  const set1 = generateRandomString(4, 0.4);
  const set2 = generateRandomString(4, 0.4);
  const set3 = generateRandomString(4, 0.4);
  const set4 = generateRandomString(4, 0.4);

  return `list-${set1}${set2}${set3}${set4}`;
}

// ________________________________________ Image ID

export function generateImageID() {
  const set1 = generateRandomString(32, 0.8);

  return `image-${set1}`;
}

// ________________________________________ Subscription ID

export function generateSubscriptionID() {
  const set1 = generateRandomString(6, 0.8);

  return `subs-${set1}`;
}

// ________________________________________ Blog ID

export function generateBlogID() {
  const set1 = generateRandomString(8, 0.8);

  return `blog-${set1}`;
}

// export function generateUniqueId() {
//   let result = "";
//   const characters = "abcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789";
//   const segmentLengths = [6, 4, 4];
  
//   for (let i = 0; i < segmentLengths.length; i++) {
//     for (let j = 0; j < segmentLengths[i]; j++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       result += characters[randomIndex];
//     }
//     if (i < segmentLengths.length - 1) {
//       result += "-";
//     }
//   }
  
//   return result;
// }
