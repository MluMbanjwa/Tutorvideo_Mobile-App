
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { WebView } from "react-native-webview";

// Escape HTML special characters
const escapeHTML = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Detect explicitly delimited LaTeX
const containsMath = (text) => {
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/.test(
    text
  );
};

const MathText = ({
  children,
  fontSize = 16,
  extraHeight = 0,
}) => {
  const text = useMemo(() => {
    return String(children ?? "")
      .replace(/\r\n?/g, "\n")
      .replace(/\\n/g, "\n")
      .trim();
  }, [children]);

  const [height, setHeight] = useState(45);
  const lastHeight = useRef(45);

  useEffect(() => {
    lastHeight.current = 45;
    setHeight(45);
  }, [text, fontSize]);

  const html = useMemo(() => {
    const safeText = escapeHTML(text).replace(
      /\n/g,
      "<br>"
    );

    return `
<!DOCTYPE html>
<html>
<head>
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
/>

<script
  defer
  src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
></script>

<script
  defer
  src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
></script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    background: transparent;
    overflow-x: hidden;
  }

  body {
    box-sizing: border-box;
    padding: 2px 4px 8px;
    color: #26394f;
    font-family: Arial, sans-serif;
    font-size: ${fontSize}px;
    line-height: 1.55;
    overflow-wrap: break-word;
  }

  .katex {
    font-size: 1.08em;
  }

  .katex-display {
    margin: 8px 0;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  #content {
    width: 100%;
    box-sizing: border-box;
  }
</style>
</head>

<body>
  <div id="content">${safeText}</div>

<script>
(function() {
  let previousHeight = 0;

  function reportHeight() {
    const content = document.getElementById("content");
    if (!content) return;

    const measured = Math.ceil(
      Math.max(
        content.getBoundingClientRect().height,
        content.scrollHeight
      ) + 12
    );

    if (Math.abs(measured - previousHeight) > 1) {
      previousHeight = measured;

      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "height",
          height: measured
        })
      );
    }
  }

  function renderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(
        document.getElementById("content"),
        {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\\\[", right: "\\\\]", display: true},
            {left: "\\\\(", right: "\\\\)", display: false},
            {left: "$", right: "$", display: false}
          ],
          throwOnError: false
        }
      );
    }

    reportHeight();
  }

  window.addEventListener("load", function() {
    renderMath();
    reportHeight();
  });

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(reportHeight).observe(
      document.getElementById("content")
    );
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reportHeight);
  }

  // Recheck after asynchronous scripts and fonts load
  let attempts = 0;
  const interval = setInterval(function() {
    if (typeof renderMathInElement === "function") {
      renderMath();
      clearInterval(interval);
    } else if (++attempts >= 40) {
      clearInterval(interval);
      reportHeight();
    }
  }, 100);
  reportHeight();
})();
</script>
</body>
</html>`;
  }, [text, fontSize]);

  if (!text) return null;

  // Plain text needs no WebView
  if (!containsMath(text)) {
    return (
      <Text
        style={[
          styles.plainText,
          {
            fontSize,
            lineHeight: fontSize * 1.55,
            marginBottom: extraHeight,
          },
        ]}
      >
        {text}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={[
          styles.webview,
          {
            height: height + extraHeight,
          },
        ]}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled={false}
        automaticallyAdjustContentInsets={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(
              event.nativeEvent.data
            );

            if (
              data.type === "height" &&
              Number.isFinite(data.height)
            ) {
              const nextHeight = Math.max(
                20,
                Math.ceil(data.height)
              );

              if (
                Math.abs(
                  nextHeight - lastHeight.current
                ) > 1
              ) {
                lastHeight.current = nextHeight;
                setHeight(nextHeight);
              }
            }
          } catch (error) {
            console.warn(
              "MathText height error:",
              error
            );
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "stretch",
  },

  webview: {
    width: "100%",
    backgroundColor: "transparent",
  },

  plainText: {
    color: "#26394f",
    flexShrink: 1,
  },
});

export default React.memo(MathText);
