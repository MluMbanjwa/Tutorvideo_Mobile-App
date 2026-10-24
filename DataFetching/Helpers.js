import AsyncStorage from "@react-native-async-storage/async-storage";

export const term = () => {
  const month = new Date().getMonth();

  if (month < 3) {
    return 1;
  }

  if (month < 6) {
    return 2;
  }

  if (month < 9) {
    return 3;
  }

  return 4;
};

export const asyncsetTerm = async (t = 0) => {
  const currentTerm = term();
  const termToStore = t === 0 ? currentTerm : t;

  await AsyncStorage.setItem("term", String(termToStore));

  return termToStore;
};

export const asyncSetGrade = async (grade) => {
  try {
    await AsyncStorage.setItem("grade", String(grade));
  } catch (error) {
    console.error("Failed to save grade:", error);
    throw error;
  }
};