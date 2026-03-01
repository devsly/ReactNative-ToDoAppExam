import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from '../screens/task/TaskListScreen';
import TaskDetailsScreen from '../screens/task/TaskDetailsScreen';
import AddTaskScreen from '../screens/task/AddTaskScreen';
import EditTaskScreen from '../screens/task/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TasksList" component={TaskListScreen} options={{headerShown:false}}/>
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{headerTitle:"Task Details"}}/>
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={{headerTitle:"Edit task"}}/>
    </Stack.Navigator>
  );
}
