import { Pressable, Text, View,StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { single } from "../../../DataFetching/SubTopics";
import ReadMoreText from "../../ReUsableComponents/view/ReadMoreText";
import MyIcon from "../../ReUsableComponents/view/Icon"
export const SubTopic = ({ id }) => {

  const navigation = useNavigation();

  const [sub, setSub] = useState(null);
  
  useEffect(() => {
    const getSubTopic = async () => {
      try {
       
        const subTopic = await single(id);
        setSub(subTopic);
      } catch (err) {
        //console.error(err);
      }
    };
    getSubTopic();
    
  }, [id]);

  if (!sub) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("WatchTopic", {
          video: sub.video,
          title:sub.title,
          description:sub.description,
        })
      }
    >
      <View style={styles.titleContainer}>
  <MyIcon
    name="play-circle"
    size={20}
    color="#2563EB"
  />

  <Text
    style={styles.title}
    numberOfLines={1}
    ellipsizeMode="tail"
  >
    {sub.title}
  </Text>
</View>

      <ReadMoreText 
      text={sub.description}
      numberOfLines={4}
      />
      
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
  marginBottom: 10,
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
