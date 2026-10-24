import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncSetGrade } from "./Helpers";
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
export const createUser = async (userData) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not create user");
  }


  return result;
};

export const loginUser = async (data) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Could not log in");
  }

  await AsyncStorage.setItem("user",JSON.stringify(result.data))
  await AsyncStorage.setItem("token",result.token)
  await asyncSetGrade(result.data.grade)
  return result.data;
};
export async function addQuestion(token, userId, questionId, correct) {
  if(!userId || !token){
    return;
  }
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/question`,
      {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({
          questionId,
          correct,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add test");
    }
    return data;
  } catch (error) {
    console.error("Error adding test:", error);
    throw error;
  }
}

export async function fetchUser(userId, token) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Failed to get user (${response.status})`
      );
    }
    return data.data;

  } catch (error) {
    console.error("fetchUser error:", error);
    throw error;
  }
}
export async function updateUser(userId,token,payload){
  try{
     const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              token
                ? `Bearer ${token}`
                : "",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );
      if(!res.ok){
        throw new Error(res);
      }
      const data=await res.json()
      return data;
  }catch(error){
    throw new Error(error.message);
  }
}
export async function forgotPassword(email) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/users/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || "Failed to send password reset email"
      );
    }
    return data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error;
  }
}

export async function updatePassword({passwords,userId,token}) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}/updatepassword`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(passwords),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to update question."
    );
  }
  return data;
}