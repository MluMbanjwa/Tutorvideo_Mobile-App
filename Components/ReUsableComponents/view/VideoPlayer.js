import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import YoutubePlayer from "react-native-youtube-iframe";
import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

const getYouTubeVideoId = (url = "") => {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const isDirectVideoUrl = (url = "") => {
  const lowerUrl = url.toLowerCase();

  return (
    lowerUrl.includes("res.cloudinary.com") ||
    lowerUrl.includes(".mp4") ||
    lowerUrl.includes(".mov") ||
    lowerUrl.includes(".m3u8")
  );
};

const DirectVideoPlayer = ({ url }) => {
  const player = useVideoPlayer(url, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      allowsFullscreen
      allowsPictureInPicture
      contentFit="contain"
    />
  );
};

const VideoPlayer = ({
  url = "",
  title = "",
  height = 230,
}) => {
  const youtubeVideoId = useMemo(
    () => getYouTubeVideoId(url),
    [url]
  );

  if (!url?.trim()) {
    return (
      <View style={[styles.messageContainer, { height }]}>
        <Text style={styles.messageText}>
          No video is available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : null}

      <View style={[styles.playerContainer, { height }]}>
        {youtubeVideoId ? (
          <YoutubePlayer
            height={height}
            videoId={youtubeVideoId}
            play={false}
            webViewStyle={styles.youtubePlayer}
            
          />
        ) : isDirectVideoUrl(url) ? (
          <DirectVideoPlayer url={url} />
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>
              This video link is not supported.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 15,

  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 10,
  },

  playerContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#000000",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  youtubePlayer: {
    backgroundColor: "#000000",
  },

  messageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
  },

  messageText: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
  },

  errorText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default VideoPlayer;