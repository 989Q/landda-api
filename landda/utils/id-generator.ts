// ________________________________________ User ID

export function generateuserID() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  function getRandomCharacter(characters: any) {
    return characters[Math.floor(Math.random() * characters.length)];
  }

  function generateRandomString(length: any, probability: any) {
    let result = '';
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

  const set1 = generateRandomString(10, 0.8);

  return `user-${set1}`;
}

// ________________________________________ Post ID

export function generatePostID() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  function getRandomCharacter(characters: any) {
    return characters[Math.floor(Math.random() * characters.length)];
  }

  function generateRandomString(length: any, probability: any) {
    let result = '';
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

  const set1 = generateRandomString(4, 0.8);
  const set2 = generateRandomString(4, 0.8);
  const set3 = generateRandomString(4, 0.8);

  return `${set1}-${set2}-${set3}`;
}

// ________________________________________ Image ID

export function generateImageID() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  function getRandomCharacter(characters: any) {
    return characters[Math.floor(Math.random() * characters.length)];
  }

  function generateRandomString(length: any, probability: any) {
    let result = '';
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

  const set1 = generateRandomString(32, 0.7);

  return `image-${set1}`;
}

// console.log(generateUniqueId());

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
