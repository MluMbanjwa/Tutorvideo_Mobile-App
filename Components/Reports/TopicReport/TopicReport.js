import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  ProgressBar,
  Stat,
  Message,
  colors,
} from "../../ReUsableComponents/view/ReportUi";

import { fetchAiQuestions } from "../../../DataFetching/Questions";
import {single} from "../../../DataFetching/Topics"
import SubmitButton from "../../ReUsableComponents/buttons/SubmitButton"
export default function TopicReport({
  route,
  navigation,
}) {
  const {
    topicId,
    topicName = "",
    user,
  } = route.params ?? {};

  const [topicQuestions, setTopicQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topic,setTopic]=useState(null);
  // ==========================================
  // FETCH TOPIC QUESTIONS
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      if (!topicId) {
        setError("No topic selected.");
        setTopicQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setTopicQuestions([]);

      try {
        // Uses the same helper convention as
        // your TermReport.
        const result = await fetchAiQuestions(
          { _id: topicId },
          null,
          "approved"
        );
        const top=await single(topicId);
        setTopic(top);
        const questions = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];
        
        if (active) {
          setTopicQuestions(questions);
        }
      } catch (err) {
        console.error(
          "Failed to fetch topic questions:",
          err
        );

        if (active) {
          setError(
            "Could not load the topic report."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      active = false;
    };
  }, [topicId]);

  // ==========================================
  // CALCULATE TOPIC PERFORMANCE
  // ==========================================

  const report = useMemo(() => {
    const ids = new Set(
      topicQuestions
        .filter((q) => q?._id != null)
        .map((q) => String(q._id))
    );

    const attempts = (
      user?.questions || []
    ).filter((attempt) =>
      ids.has(String(attempt.questionId))
    );

    const correct = attempts.filter(
      (attempt) => attempt.correct === true
    );

    const attempted = new Set(
      attempts.map((attempt) =>
        String(attempt.questionId)
      )
    ).size;

    const mastered = new Set(
      correct.map((attempt) =>
        String(attempt.questionId)
      )
    ).size;

    const total = ids.size;

    const mastery = total
      ? Math.round((mastered / total) * 100)
      : 0;

    const accuracy = attempts.length
      ? Math.round(
          (correct.length / attempts.length) * 100
        )
      : 0;

    const failed = attempts.filter(
      (attempt) => attempt.correct === false
    ).length;

    const remaining = Math.max(
      total - mastered,
      0
    );

    const level =
      attempts.length === 0
        ? "Not Started"
        : mastery >= 80
        ? "Excellent"
        : mastery >= 60
        ? "Good"
        : mastery >= 40
        ? "Developing"
        : "Needs Practice";

    const message =
      level === "Not Started"
        ? "Start practising questions from this topic."
        : level === "Excellent"
        ? "You have mastered most of the questions in this topic."
        : level === "Good"
        ? "You are doing well. Keep practising."
        : level === "Developing"
        ? "You are making progress, but more practice is needed."
        : "Keep practising and review the lesson when necessary.";

    return {
      attempted,
      mastered,
      total,
      mastery,
      accuracy,
      attempts: attempts.length,
      failed,
      remaining,
      level,
      message,
    };
  }, [user, topicQuestions]);

  // ==========================================
  // PERFORMANCE BADGE COLORS
  // ==========================================

  const tone =
    report.level === "Excellent"
      ? {
          backgroundColor: "#d9f7e8",
          color: "#137a46",
        }
      : report.level === "Good"
      ? {
          backgroundColor: "#e3f2fd",
          color: "#1565c0",
        }
      : report.level === "Developing"
      ? {
          backgroundColor: "#fff3cd",
          color: "#856404",
        }
      : report.level === "Needs Practice"
      ? {
          backgroundColor: "#fde2e2",
          color: "#b42318",
        }
      : {
          backgroundColor: "#eee",
          color: "#555",
        };

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!user) {
    return (
      <Message>
        Please log in to view your report.
      </Message>
    );
  }

  if (!topicId) {
    return (
      <Message>
        No topic selected.
      </Message>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.blue}
        />

        <Text style={styles.loadingText}>
          Calculating topic performance...
        </Text>
      </View>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return <Message>{error}</Message>;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.overline}>
          TOPIC PERFORMANCE
        </Text>

        <Text style={styles.heading}>
          {user.name || "Learner"}{" "}
          {user.surname || ""}'s Progress
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                tone.backgroundColor,
            },
          ]}
        >
          <Text
            style={{
              color: tone.color,
              fontWeight: "600",
            }}
          >
            {report.level}
          </Text>
        </View>

        <Text style={styles.subheading}>
          Topic Mastery: {topicName}
        </Text>

        <ProgressBar value={report.mastery} />

        <Text style={styles.percent}>
          {report.mastery}%
        </Text>

        <Text style={styles.description}>
          {report.message}
        </Text>

        <View style={styles.stats}>
          <Stat
            value={report.total}
            label="Topic Questions"
          />

          <Stat
            value={report.attempts}
            label="Attempts"
          />

          <Stat
            value={report.mastered}
            label="Mastered"
            tone="green"
          />

          <Stat
            value={report.failed}
            label="Failed Attempts"
            tone="red"
          />

          <Stat
            value={`${report.accuracy}%`}
            label="Accuracy"
          />

          <Stat
            value={report.remaining}
            label="Remaining"
            tone="yellow"
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            You have attempted{" "}
            {report.attempted} different
            questions and mastered{" "}
            {report.mastered} of{" "}
            {report.total} questions
            in this topic.
          </Text>
        </View>
        <SubmitButton
            onPress={ async () => {
            navigation.navigate("Test", {
              topic,
            })}}
            title="Topic Test"
            submittingText="loading Test..."
            color="blue"
            textColor="white"
                />
      </View>
    </ScrollView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    marginBottom:100,
  },

  container: {
    padding: 16,
    paddingBottom: 120,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: colors.muted,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    borderColor: colors.line,
    borderWidth: 1,
  },

  overline: {
    fontSize: 12,
    letterSpacing: 1,
    color: "#777",
  },

  heading: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
  },

  badge: {
    alignSelf: "flex-start",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 22,
  },

  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 14,
  },

  percent: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    color: colors.blue,
  },

  description: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: 8,
  },

  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
  },

  summary: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    marginTop: 12,
  },

  summaryText: {
    textAlign: "center",
    color: colors.muted,
    lineHeight: 22,
  },
});