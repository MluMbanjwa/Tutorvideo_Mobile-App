
import React, {
  useEffect,
  useState,
} from "react";

import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  ProgressBar,
  Message,
  colors,
} from "../../ReUsableComponents/view/ReportUi";

import { all} from "../../../DataFetching/Topics";
import {fetchAiQuestions} from "../../../DataFetching/Questions";
export default function TermReport({
  route,
  navigation,
}) {
  const {
    term,
    grade,
    user,
  } = route.params ?? {};
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!user || !term || !grade) {
      setTopics([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const fetchedTopics = await all(
          grade,
          term
        );
        const data = await Promise.all(
          fetchedTopics.map(async (topic) => {
            try {
              const result =
                await fetchAiQuestions(
                  topic,
                  null,
                  "approved"
                );
              const questions =
                Array.isArray(result)
                  ? result
                  : [];
              const ids = new Set(
                questions.map((q) =>
                  String(q._id)
                )
              );

              const attempts = (
                user.questions || []
              ).filter((attempt) =>
                ids.has(
                  String(attempt.questionId)
                )
              );

              const mastered = new Set(
                attempts
                  .filter(
                    (attempt) =>
                      attempt.correct === true
                  )
                  .map((attempt) =>
                    String(attempt.questionId)
                  )
              ).size;

              const attempted = new Set(
                attempts.map((attempt) =>
                  String(attempt.questionId)
                )
              ).size;

              const totalQuestions =
                questions.length;

              return {
                ...topic,
                totalQuestions,
                mastered,
                attempted,
                mastery: totalQuestions
                  ? Math.round(
                      (mastered /
                        totalQuestions) *
                        100
                    )
                  : 0,
              };
            } catch (error) {
              console.error(
                "Topic report failed",
                topic.title,
                error
              );

              return {
                ...topic,
                totalQuestions: 0,
                mastered: 0,
                attempted: 0,
                mastery: 0,
              };
            }
          })
        );

        if (active) {
          setTopics(data);
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setTopics([]);
          setError(
            "Could not load the term report."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user, term, grade]);

  if (!user) {
    return (
      <Message>
        Please log in to view your report.
      </Message>
    );
  }

  if (!term || !grade) {
    return (
      <Message>
        Please select a grade and term.
      </Message>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>
        Term {term} Report
      </Text>

      <Text style={styles.subtitle}>
        {user.name} {user.surname} · Grade {grade}
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.blue}
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Message>{error}</Message>
      ) : topics.length === 0 ? (
        <Message>
          No topics found for this term.
        </Message>
      ) : (
        topics.map((topic) => (
          <Pressable
            key={String(topic._id)}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() =>
              navigation?.navigate(
                "TopicReport",
                {
                  topicId: topic._id,
                  topicName: topic.title,
                  user: user,
                }
              )
            }
          >
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.title}>
                  {topic.title}
                </Text>

                <Text style={styles.meta}>
                  {topic.mastered} of{" "}
                  {topic.totalQuestions} questions
                  mastered
                </Text>

                <Text style={styles.meta}>
                  {topic.attempted} questions
                  attempted
                </Text>
              </View>

              <View style={styles.mastery}>
                <Text style={styles.value}>
                  {topic.mastery}%
                </Text>

                <Text style={styles.caption}>
                  Mastery
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <ProgressBar
                value={topic.mastery}
              />
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    marginBottom:100,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
   
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  mastery: {
    alignItems: "center",
  },
  value: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.blue,
  },
  caption: {
    fontSize: 12,
    color: "#777",
  },
});
