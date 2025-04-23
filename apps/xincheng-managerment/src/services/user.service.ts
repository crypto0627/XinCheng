const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL

import { createAuthHeaders } from './auth.service';

interface UpdateUserParams {
  id: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: string;
  isVerified?: boolean;
}

interface DeleteUserParams {
  id: string;
}

interface UserResponse {
  message: string;
  error?: string;
}

/**
 * Update user
 */
export const updateUser = async (params: UpdateUserParams, token?: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/user/updateUser`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in updateUser:', error);
    return { error: 'Failed to update user', message: 'Update failed' };
  }
};

/**
 * Delete user
 */
export const deleteUser = async (params: DeleteUserParams, token?: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/user/deleteUser`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return { error: 'Failed to delete user', message: 'Delete failed' };
  }
};
