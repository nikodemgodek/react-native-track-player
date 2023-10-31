import {

View, 
Text,
Dimensions,
StyleSheet,
Image,
TouchableOpacity,
FlatList

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import songs from './songs/songs';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const handlePress = () => {
    console.log('Pressed');
}

const renderSongs = ({item, index}) => {
    return(
        <View style={{ backgroundColor: '#fff', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10, alignItems: 'center', flexDirection: 'row'}}>
            <View onPress={handlePress} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={item.artwork} style={{height: 50, width: 50}}/>
                <View style={{ flexDirection: 'column', marginLeft: 10}}>
                    <Text style={{fontSize: 16, fontWeight: 500}}>{item.title}</Text>
                    <Text style={{fontSize: 12}}>{item.artist}</Text>
                </View>
            </View>
            
            <TouchableOpacity>
                <Icon name="ellipsis-horizontal-outline" size={30} color={"#32aa"}/>
            </TouchableOpacity>
        </View>
    )
  }

const MusicLibrary = () => {
    return(
        <View style={{ flex: 1 }}>
            <View style={{ height: screenHeight / 7, width: screenWidth, backgroundColor: '#32aa', justifyContent: 'flex-end'}}>
                <Text style={{fontSize: 26, fontWeight: 600, color: '#fff', margin: 20}}>Your songs</Text>
            </View>
            <FlatList
                renderItem={renderSongs}
                data={songs}
                keyExtractor={item => item.id}
                vertical
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
            />
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

})
export default MusicLibrary;