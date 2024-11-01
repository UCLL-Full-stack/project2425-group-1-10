import { User } from "../types";

const registeredEmails = new Set<string>();

export const createAccount = async (user: User): Promise<{ success: boolean; error?: string }> => {
  if (registeredEmails.has(user.email)) {
    return { success: false, error: "Email is already in use" };
  }

  registeredEmails.add(user.email);
  return { success: true };
};

