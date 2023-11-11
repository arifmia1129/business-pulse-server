/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "../../../shared/httpStatus";

const createStudent = async (
  student: IStudent,
  user: IUser,
): Promise<IUser | null> => {
  // if user don't give password use default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  // set role
  user.role = "student";

  // start session -> start transaction -> (commit transaction and end session) or (abort transaction and end session)

  let userInfo;

  // start a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // try to generate new student id
    const id = await generateStudentId();

    // throw error if generate id process is failed
    if (!id) {
      throw new ApiError(
        "Failed to generate new student id",
        httpStatus.BAD_REQUEST,
      );
    }

    // set id
    student.id = id;
    user.id = id;

    // try to create a new student
    const newStudent = await Student.create([student], { session });

    // throw error if new student not created
    // remember newStudent return an array
    if (!newStudent.length) {
      throw new ApiError(
        "Failed to create a new student",
        httpStatus.BAD_REQUEST,
      );
    }

    // set student _id to user for reference
    // remember newStudent return an array
    user.student = newStudent[0]._id;

    // try to create new user
    const newUser = await User.create([user], { session });

    userInfo = newUser[0];

    // throw error when failed to create user
    if (!newUser.length) {
      throw new ApiError("Failed to create a new user", httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (userInfo) {
    userInfo = await User.findOne({ id: userInfo.id }).populate("student");
  }
  return userInfo || null;
};

const getProfile = async (userInfo: any) => {
  const { userId, role } = userInfo;

  return await User.findOne({ role, id: userId }).populate("student");
};

export const UserService = {
  createStudent,
  getProfile,
};
