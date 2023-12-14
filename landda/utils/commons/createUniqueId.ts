import { generateUserId, addLetterId, generateListId } from "./createId";
import User from "../../models/user";
import Estate from "../../models/estate";

export const generateUniqueUserId = async () => {
  let userId: string;
  let addLetterCount = 0;

  do {
    userId = generateUserId() + addLetterId(addLetterCount);
    const existingUserId = await User.findOne({ "acc.userId": userId });
    if (!existingUserId) break;
    addLetterCount += 2;
  } while (true);

  return userId;
};

export const generateUniqueEstateId = async () => {
  let estateId = generateListId();
  let addLetterCount = 0;
  let isUnique = false;

  while (!isUnique) {
    const existingEstateId = await Estate.findOne({
      "head.estateId": estateId,
    });
    if (!existingEstateId) {
      isUnique = true;
    } else {
      addLetterCount += 2;
      estateId = generateListId() + addLetterId(addLetterCount);
    }
  }

  return estateId;
};
