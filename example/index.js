import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

LogBox.ignoreLogs(['Require cycle: ../src/react_native_apple_pay']);

AppRegistry.registerComponent(appName, () => App);
