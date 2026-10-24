import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const CLOUDINARY_CLOUD_NAME =
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;



const ImageUpload = ({
  image,
  setImage,
  title = "Profile Picture",
  folder = "TutorVideo/",
}) => {
  const [localImage, setLocalImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos to select an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedImage = result.assets[0];

      setLocalImage(selectedImage.uri);
      await uploadImage(selectedImage);
    } catch (error) {
      console.error("Image picker error:", error);

      Alert.alert(
        "Image error",
        "The image could not be selected."
      );
    }
  };

  const uploadImage = async (selectedImage) => {
    if (!CLOUDINARY_CLOUD_NAME) {
      Alert.alert(
        "Configuration error",
        "EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is missing from your .env file."
      );
      return;
    }

    if (!CLOUDINARY_UPLOAD_PRESET) {
      Alert.alert(
        "Configuration error",
        "EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is missing from your .env file."
      );
      return;
    }

    try {
      setUploading(true);

      const extension =
        selectedImage.fileName?.split(".").pop() ||
        selectedImage.mimeType?.split("/").pop() ||
        "jpg";

      const fileName =
        selectedImage.fileName ||
        `profile-${Date.now()}.${extension}`;

      const formData = new FormData();

      formData.append("file", {
        uri: selectedImage.uri,
        type: selectedImage.mimeType || "image/jpeg",
        name: fileName,
      });

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      if (folder) {
        formData.append("folder", folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ||
            "Cloudinary upload failed."
        );
      }

      setImage(result.secure_url);
      setLocalImage(result.secure_url);

      Alert.alert(
        "Upload complete",
        "Your picture was uploaded successfully."
      );
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      setLocalImage("");

      Alert.alert(
        "Upload failed",
        error.message ||
          "The image could not be uploaded."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setLocalImage("");
    setImage("");
  };

  const displayedImage = localImage || image;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {String(title).toUpperCase()}:
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.uploadBox,
          pressed && styles.uploadBoxPressed,
        ]}
        onPress={pickImage}
        disabled={uploading}
      >
        {displayedImage ? (
          <Image
            source={{ uri: displayedImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="cloud-upload-outline"
              size={42}
              color="#2563eb"
            />

            <Text style={styles.uploadText}>
              Choose a picture
            </Text>

            <Text style={styles.helpText}>
              Tap to select an image from your phone
            </Text>
          </View>
        )}

        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color="#ffffff"
            />

            <Text style={styles.loadingText}>
              Uploading...
            </Text>
          </View>
        )}
      </Pressable>

      {displayedImage && !uploading && (
        <View style={styles.actions}>
          <Pressable
            style={styles.changeButton}
            onPress={pickImage}
          >
            <Ionicons
              name="image-outline"
              size={18}
              color="#2563eb"
            />

            <Text style={styles.changeButtonText}>
              Change
            </Text>
          </Pressable>

          <Pressable
            style={styles.removeButton}
            onPress={removeImage}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color="#dc2626"
            />

            <Text style={styles.removeButtonText}>
              Remove
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 30,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  uploadBox: {
    width: "100%",
    height: 210,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderTopColor: "#b8b8b8",
    borderLeftColor: "#b8b8b8",
    borderRightColor: "#ffffff",
    borderBottomColor: "#ffffff",
    borderRadius: 14,
  },

  uploadBoxPressed: {
    opacity: 0.85,
    transform: [{ translateY: 1 }],
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  uploadText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },

  helpText: {
    marginTop: 5,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },

  loadingText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },

  changeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
  },

  changeButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
  },

  removeButtonText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});

export default ImageUpload;