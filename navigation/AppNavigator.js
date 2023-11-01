
import { createStackNavigator } from "@react-navigation/stack";

import MusicLibrary from "../MusicLibrary";
import MusicPlayerEx from "../MusicPlayerEx";

const Stack = createStackNavigator();
const AppNavigator = () => {
    return(
        <Stack.Navigator initialRouteName="MusicLibrary">
            <Stack.Screen name="MusicLibrary" component={MusicLibrary} options={{headerShown: false}}/>
            <Stack.Screen name="MusicPlayerEx" component={MusicPlayerEx} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default AppNavigator;