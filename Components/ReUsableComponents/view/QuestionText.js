import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { SvgXml } from "react-native-svg";

import MathText from "./MathText";

const QuestionView = ({
  question,
  index,
  user,
}) => {
  const hasDiagram =
    typeof question?.diagram === "string" &&
    question.diagram.trim() !== "";

  return (
    <View style={styles.questionView}>

      <View style={styles.header}>
        <Text style={styles.numbering}>
          {index}.
        </Text>
      </View>

      <MathText>
        {question?.question ?? ""}
      </MathText>

      {hasDiagram && (
        <View style={styles.questionDiagram}>
          <SvgXml
            xml={question.diagram}
            width="100%"
            height="100%"
          />
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  questionView: {
    width: "100%",
  },

  header: {
    width: "100%",
    marginBottom: 4,
  },

  numbering: {
    fontSize: 18,
    lineHeight: 26,
    color: "#26394f",
  },

  questionDiagram: {
    width: "100%",
    maxWidth: 300,
    height: 300,

    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,
    marginBottom: 16,

    padding: 8,

    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
});

export default QuestionView;