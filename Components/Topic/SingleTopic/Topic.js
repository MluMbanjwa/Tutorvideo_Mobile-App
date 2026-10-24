import { Text, Pressable, StyleSheet,View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton";
import MyIcon from "../../ReUsableComponents/view/Icon";



export const Topic = ({ topic }) => {
  const navigation = useNavigation();
  const handleTest = async () => {
      navigation.navigate("Test", {
        topic,
      });
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Subtopics", {
          title: topic.title,
          subtopics: topic.subTopics,
        })
      }
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.titleContainer}>
  <MyIcon
    name="book-open"
    size={20}
    color="#2563EB"
  />

  <Text
    style={styles.title}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {topic.title}
  </Text>
</View>
      
      <SubmitButton
        onPress={handleTest}
        title="Test"
        color="white"
        submittingText="Test loading..."
        textColor="black"
      />

      <Text style={styles.subtopicNo}>
        {topic.subTopics?.length} Subtopics
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginVertical: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 5,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  titleContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
  marginBottom: 12,
  width: "100%",
},

title: {
  flex: 1,
  fontSize: 20,
  fontWeight: "700",
  color: "#1F2937",
},

  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 23,
  },

  subtopicNo: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },

  loadingContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 5,
  },

  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  
});