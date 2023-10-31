import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Animated, ToastAndroid, TouchableNativeFeedbackComponent } from 'react-native';
import { Dimensions } from 'react-native';
import songs from './songs/songs';
import Icon from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider';
import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';

const screenWidth = Dimensions.get('window').width;

const MusicPlayer = ({route}) => {


  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [favorities, setFavorities] = useState([]);


  useEffect(() => {
    const unloadSound = async () => {
      if (sound) {
        setPosition(0);
        await sound.unloadAsync();
        console.log("Sound unloaded");
        console.log(sound);

        playSound();
      }
    }
    console.log(sound);
    unloadSound();
  }, [songIndex])
 
  useEffect(() => {
    
    scrollX.addListener( async ({value}) => {

      const index = Math.round(value / screenWidth);
      setSongIndex(index);
      console.log(songIndex);

    });

  }, []);

  const playSound = async () => {

    try {
      const { sound } = await Audio.Sound.createAsync(songs[songIndex].url);
      setSound(sound);
      console.log(sound);

      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis);

      if(isLooping) {
        await sound.setIsLoopingAsync(true);
        console.log('Loop mode: ON');
      }

      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if(status.didJustFinish) {
          await sound.unloadAsync();
          handleNextSong();
        }
      })
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  }

  const pauseSound = async () => {
    try {
      if(sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const togglePlayPauseSound = async () => {
    try {
      if(sound) {
        if(isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch ( error ) {
        console.error("Wystapil blad", error);
    }
  }

  const handlePressPlayPauseButton = () => {
    if(isPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  }

  const handlePreviousSong = async () => {
    if(flatListRef.current) {
      const prevIndex = ( songIndex - 1 + songs.length) % songs.length;
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  }

  const handleNextSong = async () => {
    if (flatListRef.current) {
      const nextIndex = (songIndex + 1) % songs.length;

      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  }

  const onSlidingStart = () => {
    setIsSliding(true);
  }

  const onSlidingComplete = async (value) => {
    if(sound) {
      await sound.setPositionAsync(value);
      setIsSliding(false);
    }
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

  const durationFormatted = (ms) => {

    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  useEffect(() => {

    const interval = setInterval(async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const sendToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }

  const handleAddMusicToFavorities = () => {
    const favoritiesArray = favorities;
    if(favoritiesArray.some(item => item.id === songs[songIndex].id)) {
        sendToast(`${songs[songIndex].artist} - ${songs[songIndex].title} is already on your list!`);
        return;
    }
    setFavorities( (prevObjects) => [...prevObjects, songs[songIndex]]);
    console.log(favorities);
    sendToast(`${songs[songIndex].artist} - ${songs[songIndex].title} is now on your favorities list`);
  }

  const handleDelMusicFromFavorities = () => {
    if(favorities.length === 0) return;
    const newArray = favorities.filter(item => item.id !== songs[songIndex].id);
    setFavorities(newArray);
    sendToast(`${songs[songIndex].artist} - ${songs[songIndex].title} deleted from favorities`);
    console.log(favorities);
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
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
        />

        {/* music duration */}
        <View style={styles.durationContainer}>
          <Text>{durationFormatted(position)}</Text>
          <Text>{durationFormatted(duration)}</Text>
        </View>

        <View style={styles.durationContainer}>
          <TouchableOpacity onPress={handleDelMusicFromFavorities}>
            <Icon name="remove-circle-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddMusicToFavorities}>
            <Icon name="add-circle-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
        </View>
      
        <View style={styles.trackButtons}>
          <TouchableOpacity onPress={handlePreviousSong}>
            <Icon name="play-skip-back-outline" size={30} color={"#32aa"}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePressPlayPauseButton}>
            {isPlaying ? <Icon name="pause-circle" size={65} color={"#32aa"}/> : <Icon name="play-circle" size={65} color={"#32aa"}/>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextSong}>
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


export default MusicPlayer;