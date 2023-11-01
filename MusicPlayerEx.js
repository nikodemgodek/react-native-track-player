import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Animated, ToastAndroid, TouchableNativeFeedbackComponent } from 'react-native';
import { Dimensions } from 'react-native';
import songs from './songs/songs';
import Icon from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const MusicPlayerEx = ( {route}) => {

    const selectedSongIndex = route.params;
    

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(selectedSongIndex);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [favorities, setFavorities] = useState([]);


  const navigation = useNavigation();

  const goBackToMusicLibrary = () => {
    navigation.navigate('MusicLibrary');  
  }
  const renderSongs = ({item, index}) => {

    return(
      <View style={styles.mainAlbumContainer}>
        <View style={styles.albumContainer}>
          <Image
            style={styles.musicImage}
            source={item.artwork}
          />
        </View>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        renderItem={renderSongs}
        data={songs}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { x: scrollX },
              },
            },
          ],
          { useNativeDriver: true},
        )}
      />
      
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>

        {/* Slider */}
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration}
          thumbTintColor='#32aa'
          minimumTrackTintColor="#32aa"
          maximumTrackTintColor="#2223"
          value={position}
        />


        <View style={styles.durationContainer}>
          <TouchableOpacity >
            <Icon name="remove-circle-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="add-circle-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
        </View>
      
        <View style={styles.trackButtons}>
          <TouchableOpacity onPress={goBackToMusicLibrary}>
            <Icon name="play-skip-back-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
          <TouchableOpacity>
            {isPlaying ? <Icon name="pause-circle" size={65} color={"#32aa"}/> : <Icon name="play-circle" size={65} color={"#32aa"}/>}
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="play-skip-forward-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainAlbumContainer : {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
  },

  albumContainer: {
    height: 300, 
    width: screenWidth-100,
    marginVertical: 10, 
  },

  musicImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    borderRadius: 20, 
    borderWidth: 0, 
  },

  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: screenWidth
  },

  progressBar: {
    width: screenWidth-100, 
    height: 40
  },

  durationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth-100
  },

  trackButtons : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: screenWidth
  },

  title: {
    fontSize: 20,

  },
  
  artist: {
    fontSize: 16,
  }

});


export default MusicPlayerEx;