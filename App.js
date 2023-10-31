import { Dimensions, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

const screenWidth = Dimensions.get('window').width;

export default function App() {
  return(
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer> 
  )
};