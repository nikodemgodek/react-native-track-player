
import { createStackNavigator } from "@react-navigation/stack";

import MusicLibrary from "../MusicLibrary";
import MusicPlayer from "../MusicPlayer";

const Stack = createStackNavigator();
const AppNavigator = () => {
    return(
        <Stack.Navigator initialRouteName="MusicLibrary">
            <Stack.Screen name="MusicLibrary" component={MusicLibrary} options={{headerShown: false}}/>
            <Stack.Screen name="MusicPlayer" component={MusicPlayer} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default AppNavigator;