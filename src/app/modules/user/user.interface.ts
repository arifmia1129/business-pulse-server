/* eslint-disable no-unused-vars */
import { HydratedDocument, Model, Types } from "mongoose";
import { ICompany } from "../company/company.interface";

export type IUser = {
  id: string;
  password: string;
  company: Types.ObjectId | ICompany;
};

export type IUserMethods = {
  isUserExist(id: string): Promise<Pick<IUser, "id" | "password"> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
};

export type UserModel = {
  createWithFullName(): Promise<HydratedDocument<IUser, IUserMethods>>;
  // name: string,
} & Model<IUser, object, IUserMethods>;
