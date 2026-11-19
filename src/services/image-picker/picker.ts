import * as ImagePicker from 'expo-image-picker';

export interface PickedImageResult {
  canceled: boolean;
  uri?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

/**
 * Launches the native device photo library picker.
 * Supports Android photo picker, iOS Photos picker, JPEG, PNG, HEIC with cropping & rotation.
 */
export async function pickPoseImage(): Promise<PickedImageResult> {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return { canceled: true };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.92,
      exif: false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { canceled: true };
    }

    const asset = result.assets[0];
    return {
      canceled: false,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType,
    };
  } catch (error) {
    console.warn('Image picker error:', error);
    return { canceled: true };
  }
}
