import {createStackNavigator} from 'react-navigation';
import HomeScreen from './src/screens/home';

const App = createStackNavigator({
  Home: {screen: HomeScreen},
})

export default App
