import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "admin" | "user";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
}

// Convert MongoDB user to safe response format
export function toUserResponse(user: User): UserResponse {
  return {
    id: user._id?.toString() || "",
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
  };
}
