export type AccessLevel = "active" | "retired" | "admin";

export interface UserData {
  email: string;
  accessLevel: AccessLevel;
} 