import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface MediaPreview {
  uri: string;
  type: 'photo' | 'video';
}

export default function PreviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { uri, type }: MediaPreview = route.params;

  const [posting, setPosting] = useState(false);

  const handleClose = () => {
    navigation.goBack(); // return to Camera screen
  };

  const handlePost = async () => {
    try {
      setPosting(true);

      const stored = await AsyncStorage.getItem('postedMedia');
      let media = stored ? JSON.parse(stored) : [];

      media.unshift({ uri, type });

      await AsyncStorage.setItem('postedMedia', JSON.stringify(media));

      setPosting(false);
      navigation.goBack(); // back to Camera
    } catch (error) {
      console.error('Error saving media:', error);
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
        <Icon name="close-outline" color="#fff" size={32} />
      </TouchableOpacity>

      {/* Media Preview */}
      {type === 'photo' ? (
        <Image source={{ uri }} style={styles.media} resizeMode="contain" />
      ) : (
        <Video
          source={{ uri }}
          style={styles.media}
          resizeMode="contain"
          controls
          paused={false} // auto-play
          muted={false} // enable audio
          repeat
        />
      )}

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.postBtn, posting && { opacity: 0.6 }]}
          onPress={handlePost}
          disabled={posting}
        >
          {posting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send-outline" color="#fff" size={22} />
              <Text style={styles.btnText}>Post</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  media: {
    flex: 1,
    width: '100%',
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3d6e',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6, // instead of gap
  },
});
