import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
  const camera = useRef<Camera>(null);
  const navigation = useNavigation<any>();

  // Permissions
  const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();

  // States
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [isPhotoMode, setIsPhotoMode] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  const recordingTimeout = useRef<number | null>(null);

  const device = useCameraDevice(cameraPosition);

  // Request permissions
  useEffect(() => {
    (async () => {
      const camGranted = hasCameraPermission || await requestCameraPermission();
      const micGranted = hasMicPermission || await requestMicPermission();
      if (camGranted && micGranted) {
        console.log("✅ Camera and Mic permissions active");
      }
      if (!camGranted) Alert.alert('Camera permission is required!');
      if (!micGranted) Alert.alert('Microphone permission is required!');
    })();
  }, [hasCameraPermission, requestCameraPermission, hasMicPermission, requestMicPermission]);

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Loading camera...</Text>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!camera.current) return;

    try {
      if (isPhotoMode) {
        // Take photo
        const photo = await camera.current.takePhoto({ flash });
        navigation.navigate('Preview', { type: 'photo', uri: `file://${photo.path}` });
      } else {
        // Video recording
        if (isRecordingRef.current) {
          // Stop recording
          if (recordingTimeout.current) {
            clearTimeout(recordingTimeout.current);
            recordingTimeout.current = null;
          }
          await camera.current.stopRecording();
          setIsRecording(false);
          isRecordingRef.current = false;
        } else {
          // Start recording
          setIsRecording(true);
          isRecordingRef.current = true;

          await camera.current.startRecording({
            fileType: 'mp4',              // <-- force .mp4 output
            videoCodec: 'h264',           // safe, widely supported codec
            onRecordingFinished: (video) => {
              if (recordingTimeout.current) clearTimeout(recordingTimeout.current);
              setIsRecording(false);
              isRecordingRef.current = false;
          
              const uri = video.path.startsWith('file://') 
                            ? video.path 
                            : `file://${video.path}`;
              navigation.navigate('Preview', { type: 'video', uri });
            },
            onRecordingError: (error) => {
              if (recordingTimeout.current) clearTimeout(recordingTimeout.current);
              console.error(error);
              setIsRecording(false);
              isRecordingRef.current = false;
              Alert.alert('Recording Error', error.message || 'Unable to record video.');
            },
          });
          
          // Auto stop after 10 seconds
          recordingTimeout.current = setTimeout(async () => {
            if (isRecordingRef.current && camera.current) {
              await camera.current.stopRecording();
              setIsRecording(false);
              isRecordingRef.current = false;
              recordingTimeout.current = null;
            }
          }, 10000);
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Something went wrong while capturing.');
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

    // Permission + device checks (above return)
  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Loading camera...</Text>
      </View>
    );
  }

  if (!hasCameraPermission || !hasMicPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Waiting for permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        audio={true} // important for microphone
        torch={flash}
      />

      {/* Controls */}
      <View style={styles.controls}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            onPress={() => setFlash(prev => (prev === 'off' ? 'on' : 'off'))}
          >
            <Icon name={flash === 'on' ? 'flash' : 'flash-off'} size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))}
          >
            <Icon name="camera-reverse" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => setIsPhotoMode(true)}>
            <Text style={[styles.modeText, isPhotoMode && styles.activeText]}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCapture}
            style={[styles.captureButton, isRecording && styles.recordingButton]}
          >
            <View style={styles.innerCircle} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsPhotoMode(false)}>
            <Text style={[styles.modeText, !isPhotoMode && styles.activeText]}>Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  modeText: { color: '#888', fontSize: 18 },
  activeText: { color: '#fff', fontWeight: 'bold' },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: { backgroundColor: 'red' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#000' },
});
