import AsyncStorage from "@react-native-async-storage/async-storage";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const all = async (g=0,t=0) => {
  let grade=g;
  let term=t;
  if(grade===0){
    grade=await AsyncStorage.getItem("grade");
  }
  if(term==0){
    term=await AsyncStorage.getItem("term");
  }
  const query = grade
    ? `?grade=${grade}&term=${term}`
    : `?term=${term}`;
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/topics${query}`,
    {
      method: "GET",
    }
  );

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || "Could not fetch topics");
  }

  return result.data;
};
export const single=async (id) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/topics/${id}`, {
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch topics");
  }

  return data.data;
};