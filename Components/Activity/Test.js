import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { fetchAiQuestions } from "../../DataFetching/Questions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Question from "../ReUsableComponents/inputs/Question";
import SubmitButton from "../ReUsableComponents/buttons/SubmitButton";
const randomize = (inputArray = [], numberOfRequiredAtRandom) => {
  const shuffled = [...inputArray].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, numberOfRequiredAtRandom);
};
const Test = ({ route }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markValue, setMarkValue] = useState(0);
  const [token,setToken]=useState(null);
  const {topic}=route.params;
  const [finish, setFinish] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [buttonText,setButtonText]=useState("Submit Test");
  const [submitingText,setSubmitingText]=useState("Marking...");
  const [testCount,setTestCount]=useState(1);
  //get QUestions
  useEffect(()=>{
    const getQuestions=async () => {
    try {
      setLoading(true);
      // AsyncStorage is asynchronous
      const token = await AsyncStorage.getItem("token");

      const questions1 = await fetchAiQuestions(
        topic,
        1,
        token,
        "approved"
      );

      const questions2 = await fetchAiQuestions(
        topic,
        2,
        token,
        "approved"
      );

      const questions3 = await fetchAiQuestions(
        topic,
        3,
        token,
        "approved"
      );

      const questions4 = await fetchAiQuestions(
        topic,
        4,
        token,
        "approved"
      );

      const all = [
        ...randomize(questions1, 4),
        ...randomize(questions2, 3),
        ...randomize(questions3, 2),
        ...randomize(questions4, 1),
      ];

      setQuestions(all);

      // IMPORTANT:
      // return the questions directly
      return all;
    } catch (error) {
      console.error("Failed to load test questions:", error);

      return [];
    } finally {
      setLoading(false);
    }}
    getQuestions();
  },[testCount]);
  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  useEffect(() => {

    const getUser = async () => {
      try {
        setLoading(true);
        const tok=await AsyncStorage.getItem("token");
        if(tok){
          setToken(tok);
        }
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to get user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // ==========================================
  // RESET TEST WHEN QUESTIONS CHANGE
  // ==========================================

  useEffect(() => {
    setMarkValue(0);
    setFinish(false);
  }, [questions]);

  // ==========================================
  // SUBMIT TEST
  // ==========================================

  const handleSubmit = async() => {
    if (finish){
      setFinish(false);
      setTestCount(testCount+1);
      setButtonText('Submit Test');
      setSubmitingText('marking...');
      return;
    }
    setFinish(true);
    setButtonText("New Test");
    setSubmitingText("Creating Test...");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading Questions...
        </Text>
      </View>
    );
  }

  // ==========================================
  // TEST
  // ==========================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Test: {topic.title} </Text>
      </View>
      <FlatList
        data={questions}

        keyExtractor={(item, index) =>
          item?._id?.toString() ?? index.toString()
        }

        renderItem={({ item, index }) => (
          <Question
            question={item}
            index={index + 1}
            user={user}
            setMarkValue={setMarkValue}
            finish={finish}
            userId={user?user._id: null}
            token={token?token: null}
          />
        )}

        contentContainerStyle={styles.listContent}

        showsVerticalScrollIndicator={false}

        // Keep inputs usable while keyboard is open
        keyboardShouldPersistTaps="handled"

        // Don't automatically close keyboard while scrolling
        keyboardDismissMode="none"

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            loading...
          </Text>
        }

        ListFooterComponent={
          questions.length > 0 ? (
            <View style={styles.footer}>
              {finish && (
                <View style={styles.results}>
                  <Text style={styles.resultsTitle}>
                    Test Complete
                  </Text>

                  <Text style={styles.resultsText}>
                    Score: {markValue} / {questions.length}
                  </Text>

                  <Text style={styles.percentage}>
                    {Math.round(
                      (markValue / questions.length) * 100
                    )}
                    %
                  </Text>
                </View>
              )}
              <SubmitButton
                  onPress={handleSubmit}
                  title={buttonText}
                  submittingText={submitingText}
                  color="blue"
                  textColor="white"
                />
            </View>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  listContent: {
    padding: 16,
    paddingBottom: 150,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
 titleContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft:10,
  gap: 1,
  marginTop:30,
  marginBottom: 0,
  width: "100%",
},

title: {
  flex: 1,
  fontSize: 20,
  fontWeight: "700",
  color: "#1F2937",
},
  footer: {
    marginTop: 10,
    marginBottom: 50,
  },

  results: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f3f6fa",
    borderRadius: 12,
  },

  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },

  resultsText: {
    fontSize: 18,
  },

  percentage: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "700",
  },
});

export default Test;