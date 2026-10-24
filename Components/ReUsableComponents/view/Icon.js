import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const MyIcon = ({
  name,
  size = 20,
  color = "blue",
  big=false,
  onPress,
  text,
}) => {
 return(
 <SafeAreaView edges={["top"]}>
  <Pressable onPress={onPress} style={styles.container}>
      <FontAwesome5 name={name} size={size} color={color}/>
    <Text style={big? styles.badge: styles.text}>{text}</Text>
  </Pressable>
  </SafeAreaView>
)};
const styles = StyleSheet.create({
  container: {
  alignItems: "center", 
  justifyContent: "center",
  margin:0,
  padding:2
  },
  text: {
  textAlign: "center",
  fontSize: 12,
  },
  badge: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 8,
    
  },

  badgeText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MyIcon;