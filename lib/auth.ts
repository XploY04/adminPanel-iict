import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getDatabase } from "./mongodb";
import { User, UserResponse, toUserResponse } from "@/types/user";

// Validate required environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Registration password is optional but recommended
if (
  process.env.NODE_ENV === "production" &&
  !process.env.ADMIN_REGISTRATION_PASSWORD
) {
  console.warn("Warning: ADMIN_REGISTRATION_PASSWORD not set in production");
}

export interface TokenPayload {
  id: string;
  email: string;
  role: "admin" | "user";
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Database operations for user authentication
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await getDatabase();
    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase() });
    return user as User | null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "admin" | "user";
}): Promise<User | null> {
  try {
    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    const newUser: Omit<User, "_id"> = {
      email: userData.email.toLowerCase(),
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    if (result.insertedId) {
      return { ...newUser, _id: result.insertedId };
    }

    return null;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserResponse | null> {
  try {
    const user = await findUserByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    const db = await getDatabase();
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Return safe user data
    return toUserResponse({ ...user, lastLogin: new Date() });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

export async function getUserById(id: string): Promise<UserResponse | null> {
  try {
    const db = await getDatabase();
    const { ObjectId } = await import("mongodb");

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const user = (await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) })) as User | null;

    if (!user || !user.isActive) {
      return null;
    }

    return toUserResponse(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}
