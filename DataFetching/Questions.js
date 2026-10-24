export async function fetchreportQuestion(questionId,token){
  try{
    const res=await fetch(`${process.env.EXPO_PUBLIC_API_URL}/questions/${questionId}/report`,
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    }
    )
    const data=await res.json();
    return data;
  }
  catch(erro){
    throw new Error("could not fetch reportQuestions()");
  }
}
export async function fetchunreportQuestion(questionId,token){
  try{
    const res=await fetch(`${process.env.EXPO_PUBLIC_API_URL}/questions/${questionId}/unreport`,
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    }
    )
    const data=await res.json();
    return data;
  }
  catch(erro){
    throw new Error("could not fetch reportQuestions()");
  }
}
export async function fetchlikeQuestion(questionId,token){
  try{
    const res=await fetch(`${process.env.EXPO_PUBLIC_API_URL}/questions/${questionId}/like`,
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    }
    )
    const data=await res.json();
    return data;
  }
  catch(erro){
    throw new Error("could not fetch reportQuestions()");
  }
}
export async function fetchunLikeQuestion(questionId,token){
  try{
    const res=await fetch(`${process.env.EXPO_PUBLIC_API_URL}/questions/${questionId}/unlike`,
      {
        method:"PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    }
    )
    const data=await res.json();
    return data;
  }
  catch(erro){
    throw new Error("could not fetch reportQuestions()");
  }
}

export async function deleteQuestions(topic,token){

   const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/questions/topic/${topic._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data=await res.json();
   if (!res.ok) {
   throw new Error(data.message || "Failed to Delete questions");
  }
  return data;
};
export const updateQuestion = async (
  questionId,
  token,
  updates
) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/questions/${questionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to update question."
    );
  }
  return data;
};
export async function fetchAiQuestions(
  topic,
  level,
  token = null,
  status = ""
) {
  try {
    if (!topic?._id) {
      console.error("fetchAiQuestions: topic._id is missing");
      return [];
    }

    const params = new URLSearchParams();

    params.set("parentTopic", topic._id);

    if (level !== undefined && level !== null && level !== "") {
      params.set("level", level);
    }

    if (status) {
      params.set("status", status);
    }

    // Only add Authorization when the user is logged in
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/questions?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
        headers,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();

      console.error(
        `Practice API error ${res.status}:`,
        errorText
      );

      return [];
    }

    const data = await res.json();

    return data?.data || [];
  } catch (error) {
    console.error(
      "Failed to fetch practice questions:",
      error
    );

    return [];
  }
}