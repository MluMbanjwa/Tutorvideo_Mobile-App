import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { Topic } from "../SingleTopic/Topic";
import { all } from "../../../DataFetching/Topics";
import MyIcon from "../../ReUsableComponents/view/Icon";
import UserDropdown from "../../ReUsableComponents/inputs/UserComboBox";

const TopicList = ({ route }) => {
  const initialGrade = route.params?.grade ?? 9;
  const initialTerm = route.params?.term ?? 1;

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [grade, setGrade] = useState(initialGrade);
  const [term, setTerm] = useState(initialTerm);

  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showTermDropdown, setShowTermDropdown] = useState(false);

  const handleChangeGrade = () => {
    setShowGradeDropdown((previous) => !previous);
    setShowTermDropdown(false);
  };

  const handleChangeTerm = () => {
    setShowTermDropdown((previous) => !previous);
    setShowGradeDropdown(false);
  };

  const selectGrade = (value) => {
    setGrade(Number(value));
    setShowGradeDropdown(false);
  };

  const selectTerm = (value) => {
    setTerm(Number(value));
    setShowTermDropdown(false);
  };

  useEffect(() => {
    let isMounted = true;

    const getTopics = async () => {
      setLoading(true);

      try {
        const data = await all(grade, term);

        if (isMounted) {
          setTopics(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);

        if (isMounted) {
          setTopics([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getTopics();

    return () => {
      isMounted = false;
    };
  }, [grade, term]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <MyIcon
          name="graduation-cap"
          text={`Grade ${grade}`}
          onPress={handleChangeGrade}
          big
        />
        <MyIcon
          name="calendar-alt"
          size={22}
          text={`Term ${term}`}
          onPress={handleChangeTerm}
          big
        />
      </View>

      {showGradeDropdown && (
        <View style={styles.dropdownContainer}>
          <UserDropdown
            data={[
              { label: "Grade 7", value: 7 },
              { label: "Grade 8", value: 8 },
              { label: "Grade 9", value: 9 },
              { label: "Grade 10", value: 10 },
              { label: "Grade 11", value: 11 },
              { label: "Grade 12", value: 12 },
            ]}
            value={grade}
            setValue={selectGrade}
            placeholder="Select a grade"
          />
        </View>
      )}

      {showTermDropdown && (
        <View style={styles.dropdownContainer}>
          <UserDropdown
            data={[
              { label: "Term 1", value: 1 },
              { label: "Term 2", value: 2 },
              { label: "Term 3", value: 3 },
              { label: "Term 4", value: 4 },
            ]}
            value={term}
            setValue={selectTerm}
            placeholder="Select a term"
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading Grade {grade}, Term {term} topics...
          </Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Topic
              topic={item}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            topics.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No topics found for Grade {grade}, Term {term}.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom:40,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  dropdownContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    zIndex: 10,
    elevation: 10,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 16,
    color: "#4B5563",
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 100,
  },

  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
});

export default TopicList;