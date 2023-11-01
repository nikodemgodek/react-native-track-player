import {

View, 
Text,
Dimensions,
StyleSheet,
Image,
TouchableOpacity,
FlatList

} from 'react-native';

import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons'
import songs from './songs/songs';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MAIN_COLOR = "#e7a812";

const MAIN_COLOR_DARK = "#252526";

const MAIN_COLOR_DARK_RGBA = 'rgba(37, 37, 38, 0.8)';

const MusicLibrary = () => {

    const navigation = useNavigation();
    const [musicList, setMusicList] = useState(songs);
    const [currentSong, setCurrentSong] = useState();
    const [currentSongIndex, setCurrentSongIndex] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(null);
    const [duration, setDuration] = useState(null);
    const [isSliding, setIsSliding] = useState();
    const [musicDetails, setMusicDetails] = useState(true);


    const handlePress = (index) => {
        console.log('Pressed');
        //navigation.navigate('MusicPlayerEx', songs[index].id);
        console.log(musicList[index].artist);
    }

    const handlePlayPauseSong = async () => {
        if(isPlaying) {
            setIsPlaying(false);
            await currentSong.pauseAsync();
        } else {
            setIsPlaying(true);
            await currentSong.playAsync();
        }
    }

    const loadAndPlayMusic = async (item) => {
        if(currentSong) {
            await currentSong.unloadAsync();

        }
        const { sound } = await Audio.Sound.createAsync(item.url);
        setCurrentSong(sound);
        setCurrentSongIndex(item.id);

        sound.setOnPlaybackStatusUpdate((status) => {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
        });

        await sound.playAsync();
        setIsPlaying(true);
    }

    useEffect( () => {
        return currentSong
            ? () => {
                currentSong.unloadAsync();
                setIsPlaying(false);
            }
            : undefined;
    }, [currentSong]);
    
    const renderSongs = ({item, index}) => {
        return(
            <TouchableOpacity style={{marginVertical: 2}} onPress={() => loadAndPlayMusic(item)}>
                <View style={{ backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                    <View onPress={handlePress} style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Image source={item.artwork} style={{height: 50, width: 50}}/>
                        <View style={{ flexDirection: 'column', marginLeft: 10}}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                {currentSongIndex === item.id ? <Icon name="musical-notes-outline" size={15} color={MAIN_COLOR}/> : null}        
                                <Text style={currentSongIndex === item.id ? styles.titleIsPlaying : styles.title}>{item.title}</Text>
                            </View>
                            <Text style={styles.artist}>{item.artist}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            
        )
      }

      const onSlidingStart = () => {
        setIsSliding(true);
      }
    
      const onSlidingComplete = async (value) => {
        if(currentSong) {
          await currentSong.setPositionAsync(value);
          setIsSliding(false);
        }
      }

      const durationFormatted = (ms) => {

        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }

      const handlePreviousSong = () => {
          const prevIndex = ( currentSongIndex - 1 + musicList.length) % musicList.length;
          setCurrentSongIndex(prevIndex);
          loadAndPlayMusic(musicList[prevIndex]);
      }
    
      const handleNextSong = () => {
          const nextIndex = (currentSongIndex + 1) % musicList.length;
          setCurrentSongIndex(nextIndex);
          loadAndPlayMusic(musicList[nextIndex]);
      }

    return(
        <View style={{ flex: 1 }}>
            <View style={{ height: screenHeight / 7, width: screenWidth, backgroundColor: MAIN_COLOR_DARK, justifyContent: 'flex-end'}}>
                <Text style={{fontSize: 26, fontWeight: 600, color: '#fff', margin: 20}}>Your songs</Text>
            </View>
            <FlatList
                renderItem={renderSongs}
                data={musicList}
                keyExtractor={item => item.id}
                vertical
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
            />
            {!musicDetails && currentSongIndex && musicList ? 
                <View style={[{ overflow: 'hidden', width: screenWidth-20, height: 50, backgroundColor: MAIN_COLOR_DARK_RGBA, position: 'absolute', bottom: 50, left: 0, borderRadius: 15, marginLeft: 10, justifyContent: 'center' }, styles.boxShadow]}>
                    <View style={{ margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={() => setMusicDetails(true)}>
                            <View style={{ flexDirection: 'column', marginLeft: 10}}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 600}}>{currentSongIndex && musicList ? musicList[currentSongIndex].title : null}</Text>
                                <Text style={{ color: '#F7E4B5'}}>{currentSongIndex && musicList ? musicList[currentSongIndex].artist : null}</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={handlePlayPauseSong}>
                            {isPlaying ? <Icon name="pause" size={25} color={'white'}/> : <Icon name="play" size={25} color={'white'}/>}
                        </TouchableOpacity>
                    </View>
                    {/* Slider */}
                    <Slider
                        style={styles.progressBar}
                        minimumValue={0}
                        maximumValue={duration}
                        thumbTintColor='transparent'
                        minimumTrackTintColor={MAIN_COLOR}
                        maximumTrackTintColor="#ccc"
                        value={position}
                        onSlidingStart={onSlidingStart}
                        onSlidingComplete={onSlidingComplete}
                    />
                </View>
            :   null }

            {musicDetails && currentSongIndex && musicList ?
                <View style={[{ overflow: 'hidden', width: screenWidth-20, height: 200, backgroundColor: MAIN_COLOR_DARK_RGBA, position: 'absolute', bottom: 50, left: 0, borderRadius: 15, marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}, styles.boxShadow]}>
                    <TouchableOpacity onPress={() => setMusicDetails(false)}>
                        <View>
                            <Image style={{ height: 100, width: 100}} source={musicList[currentSongIndex].artwork}/>
                        </View>
                    </TouchableOpacity>
                    
                    <View style={{ alignItems: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 600}}>{currentSongIndex && musicList ? musicList[currentSongIndex].title : null}</Text>
                        <Text style={{ color: '#F7E4B5'}}>{currentSongIndex && musicList ? musicList[currentSongIndex].artist : null}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: 150, marginTop: 10}}>
                            <TouchableOpacity onPress={handlePreviousSong}>
                                <Icon name="play-skip-back-outline" size={20} color={"#fff"}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePlayPauseSong}>
                                {isPlaying ? <Icon name="pause-circle" size={35} color={"#fff"}/> : <Icon name="play-circle" size={35} color={"#fff"}/>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNextSong}>
                                <Icon name="play-skip-forward-outline" size={20} color={"#fff"}/>
                            </TouchableOpacity>
                        </View>
                        {/* Slider */}
                        <Slider
                            style={styles.progressBarDetailed}
                            minimumValue={0}
                            maximumValue={duration}
                            thumbTintColor='transparent'
                            minimumTrackTintColor="#fff"
                            maximumTrackTintColor="#ccc"
                            value={position}
                            onSlidingStart={onSlidingStart}
                            onSlidingComplete={onSlidingComplete}
                        />
                        {/* music duration */}
                        <View style={styles.durationContainer}>
                            <Text style={{ color: '#fff', fontSize: 10}}>{durationFormatted(position)}</Text>
                            <Text style={{ color: '#fff', fontSize: 10}}>{durationFormatted(duration)}</Text>
                        </View>
                    </View>
                </View>
            :   null }
        </View>
    )
}

const styles = StyleSheet.create({

    musicImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
    },
    title: { 
        fontSize: 16, fontWeight: 500
    },
    titleIsPlaying : {
        color: MAIN_COLOR,
        fontWeight: 800,
        fontSize: 16,
        marginLeft: 4
    },
    boxShadow : {
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 14,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    progressBar : {
        position: 'absolute',
        bottom: -20,
        width: '100%',
        marginHorizontal: 0
    },
    progressBarDetailed : {
        width: 150
    },
    durationContainer : {
        width: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})
export default MusicLibrary;