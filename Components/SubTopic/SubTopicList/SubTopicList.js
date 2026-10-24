
import { Text,View,FlatList,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SubTopic } from "../SingleSubTopic/SubTopic";

const SubTopiclist=({route})=>{
    const {
    title = "Subtopics",
    subtopics = [],
  } = route.params || {};
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
            data={subtopics}
            renderItem={(item)=>{
                return(
                        <SubTopic id={item.item._id} key={item.item._id} styles={styles.subTopic}/>
                );
            }}
            />
        </SafeAreaView>
    )
}


export const styles = StyleSheet.create({
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
    marginBottom:150,
    elevation: 5,
    marginBottom:100,
    paddingBottom:100,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 23,
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
export default SubTopiclist;