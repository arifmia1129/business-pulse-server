import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: 0,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  },
);

// use instance method to check user exist or not
userSchema.methods.isUserExist = async function (
  id: string,
): Promise<Pick<IUser, "id" | "password"> | null> {
  return await User.findOne({ id }, { id: 1, password: 1 });
};

// use instance method to check user login password is right or not
userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre("save", async function (next) {
  // hashing password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const User = model<IUser, UserModel>("User", userSchema);

export default User;
