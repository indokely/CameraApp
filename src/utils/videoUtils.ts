import { InteractionManager } from 'react-native';
import { Video } from 'react-native-compressor';

type ProgressCallback = (progress: number) => void;

/**
 * Compresses video off the main JS thread for smoother UI performance.
 * Uses the same settings as in CameraScreen.
 */
export const compressVideoOffMainThread = async (
  uri: string,
  onProgress?: ProgressCallback
): Promise<string> => {
  return new Promise((resolve, reject) => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        const compressed = await Video.compress(
          uri,
          {
            compressionMethod: 'auto',
            maxSize: 720, // same as CameraScreen
            minimumFileSizeForCompress: 3, // MB
            bitrate: 4_000_000, // upper limit if auto overshoots
          },
          progress => {
            if (onProgress) onProgress(progress);
          }
        );
        resolve(compressed);
      } catch (error) {
        console.error('❌ Compression failed (off-thread):', error);
        reject(error);
      }
    });
  });
};
