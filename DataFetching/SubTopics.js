const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const all=async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/subtopics`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch Subtopics");
  }

  return data;
};
export const single=async (id) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/subtopics/${id}`, {
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch Subtopics");
  }
  return data.data;
};