import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TasksStack from './TaskStack';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="TasksTab"
        component={TasksStack}
        options={{ headerShown: false, title: 'Tasks' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
