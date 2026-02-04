import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/task/TaskListScreen';
import TaskDetailsScreen from '../screens/task/TaskDetailsScreen';
import AddTaskScreen from '../screens/task/AddTaskScreen';
import EditTaskScreen from '../screens/task/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={TaskListScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} />
    </Stack.Navigator>
  );
}
