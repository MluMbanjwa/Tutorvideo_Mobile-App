
import { useCallback, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { asyncsetTerm } from "../../DataFetching/Helpers";

// ==========================================
// FEATURE CARD
// ==========================================

const FeatureCard = ({
  icon,
  title,
  description,
  color = "#2563eb",
}) => {
  return (
    <View style={styles.featureCard}>
      <View
        style={[
          styles.featureIcon,
          { backgroundColor: `${color}15` },
        ]}
      >
        <FontAwesome5
          name={icon}
          size={22}
          color={color}
          solid
        />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
};

// ==========================================
// LEARNING STEP
// ==========================================

const LearningStep = ({
  number,
  title,
  description,
  last = false,
}) => {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>
            {number}
          </Text>
        </View>

        {!last && (
          <View style={styles.stepLine} />
        )}
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
};

// ==========================================
// HOME
// ==========================================

const Home = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD HOME DATA
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadHomeData = async () => {
        try {
          const newTerm = await asyncsetTerm();

          const storedUser =
            await AsyncStorage.getItem("user");

          if (!active) return;

          setCurrentTerm(newTerm);

          setUser(
            storedUser
              ? JSON.parse(storedUser)
              : null
          );
        } catch (error) {
          console.error(
            "Failed to load home data:",
            error
          );

          if (active) {
            setUser(null);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      loadHomeData();

      return () => {
        active = false;
      };
    }, [])
  );

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToTopics = () => {
    navigation.navigate("Topics");
  };

  const goToSignIn = () => {
    navigation.navigate("SignIn");
  };

  const goToSignUp = () => {
    navigation.navigate("SignUp");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2563eb"
        />

        <Text style={styles.loadingText}>
          Loading TutorVideo...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}

        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <FontAwesome5
                name="graduation-cap"
                size={25}
                color="#ffffff"
              />
            </View>

            <View>
              <Text style={styles.brandName}>
                TutorVideo
              </Text>

              <Text style={styles.brandTagline}>
                Math Made Simple
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {user
              ? `Welcome back, ${user.name || "Learner"}!`
              : "Learn Mathematics with Confidence"}
          </Text>

          <Text style={styles.heroDescription}>
            Watch, practise, and improve your
            Mathematics skills with CAPS-aligned
            learning resources for Grades 7–12.
          </Text>

          {user && (
            <View style={styles.userInfoRow}>
              {user.grade && (
                <View style={styles.infoBadge}>
                  <FontAwesome5
                    name="book"
                    size={12}
                    color="#ffffff"
                  />

                  <Text style={styles.infoBadgeText}>
                    Grade {user.grade}
                  </Text>
                </View>
              )}

              {currentTerm != null && (
                <View style={styles.infoBadge}>
                  <FontAwesome5
                    name="calendar-alt"
                    size={12}
                    color="#ffffff"
                  />

                  <Text style={styles.infoBadgeText}>
                    Term {currentTerm}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.heroButton,
              pressed && styles.pressed,
            ]}
            onPress={
              user ? goToTopics : goToSignIn
            }
          >
            <FontAwesome5
              name={user ? "play-circle" : "sign-in-alt"}
              size={17}
              color="#1e40af"
            />

            <Text style={styles.heroButtonText}>
              {user
                ? "Start Learning"
                : "Sign In to Start Learning"}
            </Text>

            <FontAwesome5
              name="arrow-right"
              size={14}
              color="#1e40af"
            />
          </Pressable>

          {!user && (
            <Pressable
              onPress={goToSignUp}
              style={styles.createAccountButton}
            >
              <Text style={styles.createAccountText}>
                New to TutorVideo? Create an Account
              </Text>
            </Pressable>
          )}
        </View>

        {/* INTRODUCTION */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Mathematics Learning Companion
          </Text>

          <Text style={styles.sectionDescription}>
            TutorVideo helps South African learners
            understand Mathematics through structured
            lessons, interactive questions, and
            detailed feedback.
          </Text>

          <Text style={styles.sectionDescription}>
            Whether you're preparing for examinations,
            revising difficult topics, or improving
            your results, TutorVideo gives you
            opportunities to learn and practise
            at your own pace.
          </Text>
        </View>

        {/* FEATURES */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What You Can Do
          </Text>

          <Text style={styles.sectionDescription}>
            Everything you need to build your
            Mathematics confidence.
          </Text>

          <FeatureCard
            icon="book-open"
            title="CAPS-Aligned Mathematics"
            description="Explore Mathematics topics organised by grade, school term, and subtopic for Grades 7–12."
            color="#2563eb"
          />

          <FeatureCard
            icon="play-circle"
            title="Watch Video Lessons"
            description="Learn Mathematics through video explanations that you can watch at your own pace."
            color="#7c3aed"
          />

          <FeatureCard
            icon="edit"
            title="Interactive Practice"
            description="Answer Mathematics questions and complete practice tests to assess your understanding."
            color="#059669"
          />

          <FeatureCard
            icon="check-circle"
            title="Instant Feedback"
            description="Get your score, see which answers are correct or incorrect, and identify areas that need improvement."
            color="#0891b2"
          />

          <FeatureCard
            icon="calculator"
            title="Step-by-Step Solutions"
            description="Understand how to solve questions through detailed mathematical explanations and worked solutions."
            color="#ea580c"
          />

          <FeatureCard
            icon="chart-line"
            title="Performance Reports"
            description="Review your performance by topic, term, and year to identify strengths and areas requiring more practice."
            color="#9333ea"
          />

          <FeatureCard
            icon="redo-alt"
            title="Practise Until You Improve"
            description="Attempt new questions, revisit challenging topics, and continue practising to strengthen your skills."
            color="#db2777"
          />
        </View>

        {/* HOW IT WORKS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Learning Journey
          </Text>

          <Text style={styles.sectionDescription}>
            Follow these simple steps to make the
            most of TutorVideo.
          </Text>

          <View style={styles.stepsCard}>
            <LearningStep
              number="1"
              title="Choose Your Grade and Term"
              description="Select the grade and school term you want to study."
            />

            <LearningStep
              number="2"
              title="Explore Mathematics Topics"
              description="Browse the available topics and select what you want to learn."
            />

            <LearningStep
              number="3"
              title="Watch and Understand"
              description="Watch video lessons and study the mathematical concepts."
            />

            <LearningStep
              number="4"
              title="Test Your Knowledge"
              description="Complete practice activities and submit your answers."
            />

            <LearningStep
              number="5"
              title="Learn From Your Mistakes"
              description="Review your score, correct answers, and step-by-step solutions."
            />

            <LearningStep
              number="6"
              title="Track Your Progress"
              description="Use your performance reports to see where you're doing well and what needs more attention."
              last
            />
          </View>
        </View>

        {/* PRACTICE SECTION */}

        <View style={styles.practiceCard}>
          <FontAwesome5
            name="brain"
            size={34}
            color="#2563eb"
          />

          <Text style={styles.practiceTitle}>
            Practice Makes Progress
          </Text>

          <Text style={styles.practiceDescription}>
            Mathematics becomes easier when you
            practise regularly. Challenge yourself
            with questions at different difficulty
            levels and learn from every attempt.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={
              user ? goToTopics : goToSignIn
            }
          >
            <Text style={styles.primaryButtonText}>
              {user
                ? "Explore Topics"
                : "Get Started"}
            </Text>

            <FontAwesome5
              name="arrow-right"
              size={14}
              color="#ffffff"
            />
          </Pressable>
        </View>

        {/* NEED HELP */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Need Help Getting Started?
          </Text>

          <Text style={styles.sectionDescription}>
            Start by choosing your grade and term.
            Open a Mathematics topic, watch the
            available lessons, and complete a
            practice activity.
          </Text>

          <Text style={styles.sectionDescription}>
            After submitting your answers, review
            the feedback and worked solutions.
            You can then practise again or explore
            another topic.
          </Text>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            TutorVideo
          </Text>

          <Text style={styles.footerText}>
            Learn. Practise. Improve.
          </Text>

          <Text style={styles.footerCaption}>
            Math Made Simple – Aligned with CAPS
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef3f8",
  },

  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  // HERO

  hero: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 35,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  brandName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#ffffff",
  },

  brandTagline: {
    fontSize: 12,
    color: "#bfdbfe",
    marginTop: 2,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 36,
    marginBottom: 12,
  },

  heroDescription: {
    fontSize: 15,
    color: "#dbeafe",
    lineHeight: 24,
  },

  userInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  infoBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },

  heroButton: {
    marginTop: 25,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  heroButtonText: {
    color: "#1e40af",
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },

  createAccountButton: {
    marginTop: 18,
    alignItems: "center",
  },

  createAccountText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    textAlign: "center",
  },

  // SECTIONS

  section: {
    marginHorizontal: 18,
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 10,
  },

  sectionDescription: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 24,
    marginBottom: 12,
  },

  // FEATURE CARDS

  featureCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },

  featureDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 21,
  },

  // LEARNING STEPS

  stepsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  stepRow: {
    flexDirection: "row",
    minHeight: 90,
  },

  stepIndicator: {
    alignItems: "center",
    width: 36,
    marginRight: 14,
  },

  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumber: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#bfdbfe",
    marginVertical: 5,
  },

  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },

  stepDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 21,
  },

  // PRACTICE

  practiceCard: {
    backgroundColor: "#dbeafe",
    marginHorizontal: 18,
    marginTop: 28,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  practiceTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e3a8a",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 10,
  },

  practiceDescription: {
    fontSize: 15,
    lineHeight: 23,
    color: "#334155",
    textAlign: "center",
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.8,
  },

  // FOOTER

  footer: {
    alignItems: "center",
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginTop: 20,
  },

  footerBrand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563eb",
  },

  footerText: {
    fontSize: 14,
    color: "#475569",
    marginTop: 6,
  },

  footerCaption: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
  },
});

export default Home;
