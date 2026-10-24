import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import QuestionView from "../view/QuestionText";
import UserDropdown from "../inputs/UserComboBox";
import UserInput from "../inputs/UserInput";
import SolutionView from "../view/QuestionSolution";
import { addQuestion } from "../../../DataFetching/Users";
const Question = ({
  question,
  index,
  user,
  setMarkValue,
  finish,
  userId=null,
  token=null
}) => {
  const [answer, setAnswer] = useState("");
  const [tick, setTick] = useState(false);
const [options,setOptions]=useState([]);

  // Prevent marking the same question twice
  const marked = useRef(false);
useEffect(()=>{
  const symb=["A","B","C","D","E","F"];
  const op=[];
  for(let i=0;i<question.options.length;i++){
     op.push({label:`${symb[i]}) ${question.options[i]}`,value:question.options[i]})
  }
  setOptions(op);
},[question.options])
  // ==========================================
  // NORMALIZE ANSWERS
  // ==========================================

  const normalizeAnswer = (value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  // ==========================================
  // VALIDATE ANSWER
  // ==========================================

  const validator = () => {
    const correctAnswers = question?.correctAnswer ?? [];

    const correct = correctAnswers.some(
      (correctAnswer) =>
        normalizeAnswer(correctAnswer) ===
        normalizeAnswer(answer)
    );

    setTick(correct);

    if (correct) {
      setMarkValue((previous) => previous + 1);
    }

    return correct;
  };

  // ==========================================
  // MARK QUESTION
  // ==========================================

  const markQuestion = async () => {
    if (marked.current) return;

    marked.current = true;

    const correct = validator();

    if(userId!=null && token!=null){
    const res=await addQuestion(token,userId,question._id,correct);
    }

  };

  // ==========================================
  // FINISH TEST
  // ==========================================

  useEffect(() => {
    if (finish) {
      markQuestion();
    }
  }, [finish]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.questionContainer}>
      <QuestionView
        question={question}
        index={index}
        user={user}
      />

      <View style={styles.answerContainer}>
        {question?.questionType === "multiple-choice" ? (
          <UserDropdown
            data={options}
            value={answer}
            placeholder="Choose the correct answer"
            setValue={setAnswer}
            disabled={finish}
            math={true}
          />
        ) : (
          <UserInput
          name="Write your answer"
            value={answer}
            setValue={setAnswer}
            placeholder="Enter your answer"
            disabled={finish}
          />
        )}
      </View>

      {finish && (
        <View style={styles.feedbackContainer}>
          <View style={styles.result}>
            {tick ? (
              <>
                <FontAwesome5
                  name="check-circle"
                  size={28}
                  color="green"
                />

                <Text style={styles.correctText}>
                  Correct
                </Text>
              </>
            ) : (
              <>
                <FontAwesome5
                  name="times-circle"
                  size={28}
                  color="red"
                />

                <Text style={styles.wrongText}>
                  Incorrect
                </Text>
              </>
            )}
          </View>

          {!tick && (
            <View style={styles.correctAnswerContainer}>
              <Text style={styles.correctAnswerLabel}>
                Correct answer:
              </Text>

              <SolutionView solution={question.solution}/>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    width: "100%",
    marginBottom: 24,
    padding: 16,

    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#dfe5ec",
    borderRadius: 14,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 9,
  },

  answerContainer: {
    marginTop: 18,
  },

  feedbackContainer: {
    marginTop: 16,
  },

  result: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  correctText: {
    color: "green",
    fontSize: 17,
    fontWeight: "600",
  },

  wrongText: {
    color: "red",
    fontSize: 17,
    fontWeight: "600",
  },

  correctAnswerContainer: {
    marginTop: 4,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },

  correctAnswerLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },

  correctAnswer: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default Question;