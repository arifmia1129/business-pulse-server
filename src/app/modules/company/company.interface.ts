/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from "mongoose";

export type ICompany = {
  id: string;
  role: "student" | "instructor" | "admin";
  password: string;
  changePasswordAt: Date;
  needChangePassword: boolean;
};

export type ICompanyMethods = {
  isComaICompanyExist(
    id: string,
  ): Promise<Pick<
    ICompany,
    "id" | "password" | "role" | "needChangePassword"
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
};

export type ComaICompanyModel = {
  createWithFullName(): Promise<HydratedDocument<ICompany, ICompanyMethods>>;
  // name: string,
} & Model<ICompany, object, ICompanyMethods>;
