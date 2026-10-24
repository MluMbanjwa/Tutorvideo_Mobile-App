import VideoPlayer from "../ReUsableComponents/view/VideoPlayer";
import { View ,Text,ScrollView,StyleSheet} from "react-native";
import styles from "../TopicsStyle";
import ReadMoreText from "../ReUsableComponents/view/ReadMoreText";

const WatchTopic=({route})=>{
    const {parentTopic,title,video,description}=route.params;


 
    
    return (
        <ScrollView style={styles.container} edges={["top"]}>
            <VideoPlayer 
                title={title}
                url={video}
            />
            <ReadMoreText text={description} numberOfLines={4}/>
            
        </ScrollView>
    );
}


export default WatchTopic;