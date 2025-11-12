import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface MediaPreview {
  uri: string;
  type: 'photo' | 'video';
}

export default function ViewMediaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { uri, type }: MediaPreview = route.params;

  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  console.log('Video URI:', uri);

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close-outline" color="#fff" size={32} />
      </TouchableOpacity>

      {/* Loader while media loads */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Media Preview */}
      {type === 'photo' ? (
        <Image
          source={{ uri }}
          style={styles.media}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setPaused(!paused)}
          style={styles.videoWrapper}
        >
          <Video
            source={{ uri }}
            style={styles.media}
            resizeMode="contain"
            paused={paused}
            repeat
            controls
            onLoad={() => setLoading(false)}
            onError={(err) => console.warn('Video load error:', err)}
          />
          {paused && (
            <View style={styles.playIconWrapper}>
              <Icon name="play-circle-outline" size={64} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  media: {
    flex: 1,
    width: '100%',
    height: height,
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
