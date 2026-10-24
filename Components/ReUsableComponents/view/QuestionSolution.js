import {
  View,
  StyleSheet,
} from "react-native";

import MathText from "./MathText";

const SolutionView = ({ solution }) => {
  if (!solution) return null;

  return (
    <View style={styles.solutionContainer}>
      <MathText
        fontSize={16}
        backgroundColor="#eefbf1"
        textColor="#26394f"
      >
        {solution}
      </MathText>
    </View>
  );
};

const styles = StyleSheet.create({
  solutionContainer: {
    width: "100%",

    marginTop: 10,

    padding: 12,

    backgroundColor: "#eefbf1",

    borderWidth: 1,
    borderColor: "#8fd19e",

    borderLeftWidth: 4,
    borderLeftColor: "#28a745",

    borderRadius: 10,
  },
});

export default SolutionView;