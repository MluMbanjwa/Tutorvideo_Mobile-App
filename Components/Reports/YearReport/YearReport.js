
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
import UserDropdown from "../../ReUsableComponents/inputs/UserComboBox";

const TERMS = [1, 2, 3, 4];
const grades=[7,8,9,10,11,12];
const gradeOptions=grades.map((g)=>{
  return {
    label:`Grade ${g}`,
    value: g
  }
})
export default function YearReport({
  route,
  navigation,
}) {
  const {
    user,
    grade,
  } = route.params ?? {};
  const [selectedGrade,setGrade] =useState( grade || user?.grade);

  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!user || !selectedGrade) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          TERMS.map(async (term) => {
            const raw = await all(
              selectedGrade,
              term
            );

            const topics = Array.isArray(raw)
              ? raw
              : raw?.data || [];

            const questionLists = await Promise.all(
              topics.map(async (topic) => {
                try {
                  const questions =
                    await fetchAiQuestions(
                      topic,
                      null,
                      null,
                      "approved"
                    );

                  return Array.isArray(questions)
                    ? questions
                    : [];
                } catch (error) {
                  console.error(
                    "Failed questions",
                    topic.title,
                    error
                  );

                  return [];
                }
              })
            );

            const ids = new Set(
              questionLists
                .flat()
                .map((q) => String(q._id))
            );

            const mastered = new Set(
              (user.questions || [])
                .filter(
                  (attempt) =>
                    attempt.correct === true &&
                    ids.has(
                      String(attempt.questionId)
                    )
                )
                .map((attempt) =>
                  String(attempt.questionId)
                )
            ).size;

            const totalQuestions = ids.size;

            return {
              term,
              mastered,
              totalQuestions,
              mastery: totalQuestions
                ? Math.round(
                    (mastered / totalQuestions) *
                      100
                  )
                : 0,
            };
          })
        );

        if (active) {
          setReports(
            Object.fromEntries(
              results.map((r) => [r.term, r])
            )
          );
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setError(
            "Could not load the yearly report."
          );
          setReports({});
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
  }, [user, selectedGrade]);

  if (!user) {
    return (
      <Message>
        Please log in to view your yearly report.
      </Message>
    );
  }

  if (!selectedGrade) {
    return (
      <Message>
        Grade Required. Please update your
        profile with your current grade.
      </Message>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>
            ▦
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>
            TUTORVIDEO
          </Text>

          <Text style={styles.heading}>
            Year Report: {user.name}{" "}
            {user.surname}
          </Text>

          <Text style={styles.grade}>
            <UserDropdown name="" data={gradeOptions} placeholder={`Grade ${selectedGrade}`} value={selectedGrade} setValue={setGrade}/> 
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        Select a Term
      </Text>

      <Text style={styles.description}>
        View your overall mastery for each term.
        Select a term to see your progress for
        individual topics.
      </Text>

      {error ? (
        <Message>{error}</Message>
      ) : null}

      {TERMS.map((term) => {
        const report = reports[term];

        return (
          <Pressable
            key={term}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() =>
              navigation?.navigate("TermReport", {
                term,
                grade: selectedGrade,
                user: user,
              })
            }
          >
            <View style={styles.cardTop}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>
                  ▤
                </Text>
              </View>

              <View style={styles.numberCircle}>
                <Text style={styles.number}>
                  {term}
                </Text>
              </View>
            </View>

            <Text style={styles.termTitle}>
              Term {term}
            </Text>

            <Text style={styles.description}>
              View your learning progress and
              topic mastery for Term {term}.
            </Text>

            <View style={styles.masteryRow}>
              <Text style={styles.label}>
                Overall Mastery
              </Text>

              <Text style={styles.percent}>
                {loading
                  ? "..."
                  : `${report?.mastery || 0}%`}
              </Text>
            </View>

            <ProgressBar
              value={report?.mastery || 0}
            />

            <Text style={styles.count}>
              {loading
                ? "Calculating..."
                : `${report?.mastered || 0} of ${
                    report?.totalQuestions || 0
                  } questions mastered`}
            </Text>

            <View style={styles.link}>
              <Text style={styles.linkText}>
                View Term Report
              </Text>

              <Text style={styles.linkText}>
                →
              </Text>
            </View>
          </Pressable>
        );
      })}

      {loading && (
        <ActivityIndicator
          color={colors.blue}
          style={{ marginTop: 8 }}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eef6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 28,
    color: colors.blue,
  },
  brand: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.blue,
  },
  heading: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  grade: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  card: {
    padding: 18,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#eef6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: colors.blue,
    fontSize: 23,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontWeight: "600",
    color: "#555",
  },
  termTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 15,
    marginBottom: 6,
  },
  masteryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#555",
  },
  percent: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.blue,
  },
  count: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
  },
  link: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 18,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "600",
  },
});
