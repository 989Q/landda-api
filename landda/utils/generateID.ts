// utils/generateID.ts

function getRandomCharacter(characters: string) {
  return characters[Math.floor(Math.random() * characters.length)];
}

function generateRandomString(length: number, probability: number) {
  let result = "";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
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

// ________________________________________ add letter

export function addLetterId(count: number) {
  const set1 = generateRandomString(count, 0.5);
  return `${set1}`;
}

// ________________________________________ user ID

export function generateUserId() {
  const set1 = generateRandomString(10, 0.5);
  return `user-${set1}`;
}

// ________________________________________ list ID

export function generateListId() {
  const set1 = generateRandomString(4, 0.5);
  const set2 = generateRandomString(4, 0.5);
  const set3 = generateRandomString(4, 0.5);

  return `list-${set1}${set2}${set3}`;
}

// ________________________________________ image ID

export function generateImageId() {
  const set1 = generateRandomString(32, 0.5);

  return `image-${set1}`;
}

// ________________________________________ blog ID

export function generateBlogId() {
  const set1 = generateRandomString(8, 0.5);

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
