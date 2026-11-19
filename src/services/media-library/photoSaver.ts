import * as MediaLibrary from 'expo-media-library/legacy';
import * as FileSystem from 'expo-file-system/legacy';

const CAMASSIS_ALBUM_NAME = 'CamAssis';

export interface SaveResult {
  success: boolean;
  assetId?: string;
  albumTitle?: string;
  error?: string;
}

/**
 * Requests photo library permissions with clear rationale.
 * For saving photos, writeOnly=true allows iOS add-only permission without needing full read access.
 */
export async function requestMediaLibraryPermission(writeOnly: boolean = false): Promise<boolean> {
  try {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync(writeOnly);
    if (status === 'granted') {
      return true;
    }

    if (canAskAgain) {
      const response = await MediaLibrary.requestPermissionsAsync(writeOnly);
      return response.status === 'granted';
    }

    return false;
  } catch (err) {
    console.warn('Failed to check/request media library permissions:', err);
    return false;
  }
}

/**
 * Automatically and immediately saves the captured camera photo to the device's native Gallery/Photos.
 * Places it in a dedicated "CamAssis" album.
 * Captured photo is never uploaded to any remote server or cloud.
 * Cleans up temporary cache file after successful storage.
 */
export async function autoSavePhotoToGallery(photoUri: string): Promise<SaveResult> {
  if (!photoUri) {
    return { success: false, error: 'No photo URI provided' };
  }

  try {
    // Check permission (writeOnly permitted on iOS for add-only permission)
    const hasPermission = await requestMediaLibraryPermission(true);
    if (!hasPermission) {
      return {
        success: false,
        error: 'Photo library permission was denied. Please allow access in Settings to save your photos.',
      };
    }

    // 1. Create asset in native media library
    const asset = await MediaLibrary.createAssetAsync(photoUri);

    // 2. Add to dedicated 'CamAssis' album
    let albumTitle = 'Gallery';
    try {
      let album = await MediaLibrary.getAlbumAsync(CAMASSIS_ALBUM_NAME);
      if (album === null) {
        album = await MediaLibrary.createAlbumAsync(CAMASSIS_ALBUM_NAME, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      albumTitle = CAMASSIS_ALBUM_NAME;
    } catch (albumErr) {
      // Even if album creation is restricted on some Android OEMs, the asset was already saved to camera roll
      console.log('Saved to general Gallery (album grouping fallback):', albumErr);
    }

    // 3. Clean up the temporary camera raw file from cache to prevent storage bloat
    try {
      if (photoUri.startsWith('file://') && photoUri.includes('cache')) {
        await FileSystem.deleteAsync(photoUri, { idempotent: true });
      }
    } catch {
      // Non-critical cache cleanup failure
    }

    return {
      success: true,
      assetId: asset.id,
      albumTitle,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Could not save photo to device gallery';
    console.error('Failed to auto-save photo to device library:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Retrieves photos stored in the local CamAssis album to display on the My Photos tab.
 */
export async function getCamAssisAlbumPhotos(first: number = 30): Promise<MediaLibrary.Asset[]> {
  try {
    const hasPermission = await requestMediaLibraryPermission(false);
    if (!hasPermission) return [];

    const album = await MediaLibrary.getAlbumAsync(CAMASSIS_ALBUM_NAME);
    if (!album) {
      return [];
    }

    const result = await MediaLibrary.getAssetsAsync({
      album: album,
      sortBy: ['creationTime'],
      first,
      mediaType: ['photo'],
    });

    return result.assets;
  } catch (err) {
    console.warn('Failed to retrieve CamAssis album assets:', err);
    return [];
  }
}
