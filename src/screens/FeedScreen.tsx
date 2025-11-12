import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

interface MediaItem {
  uri: string;
  type: 'photo' | 'video';
}

export default function FeedScreen() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (isFocused) loadMedia();
  }, [isFocused]);

  const loadMedia = async () => {
    const data = await AsyncStorage.getItem('postedMedia');
    if (data) setMedia(JSON.parse(data));
  };

  const clearAll = async () => {
    await AsyncStorage.removeItem('postedMedia');
    setMedia([]);
  };

  const renderItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.item}
      onPress={() =>
        navigation.navigate('ViewMedia', { uri: item.uri, type: item.type })
      }
    >
      {item.type === 'photo' ? (
        <Image source={{ uri: item.uri }} style={styles.image} />
      ) : (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: item.uri }}
            style={styles.image}
            muted
            resizeMode="cover"
            repeat
          />
          {/* Overlay play icon */}
          <View style={styles.playOverlay}>
            <Icon name="play-circle-outline" size={36} color="#fff" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {media.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: '#aaa' }}>No posts yet</Text>
        </View>
      ) : (
        <FlatList
          data={media}
          numColumns={3}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
        />
      )}

      {media.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Icon name="trash-outline" color="#fff" size={22} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  item: { width: ITEM_SIZE, height: ITEM_SIZE, margin: 1 },
  image: { width: '100%', height: '100%' },

  videoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff3d6e',
    borderRadius: 25,
    padding: 12,
  },
});
