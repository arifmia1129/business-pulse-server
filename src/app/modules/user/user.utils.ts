import User from "./user.model";

// generate id
const getLastId = async (): Promise<string | null> => {
  const lastId = await User.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastId?.id ? lastId.id.substring(4) : "0";
};

export const generateUserId = async (): Promise<string> => {
  const lastId: string = (await getLastId()) as string;
  const currentId = (Number(lastId) + 1).toString().padStart(5, "0");

  return currentId;
};
