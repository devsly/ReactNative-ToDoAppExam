import { View, Text, Pressable } from 'react-native';



export default function TaskListScreen({ navigation }) {

  return (
    <View >
      <Text >My Tasks</Text>

      <Text>All tasks shown here</Text>

      {/* Add new task */}
      <Pressable onPress={() => navigation.navigate('AddTask')} >
        <Text >＋</Text>
      </Pressable>
    </View>
  );
}

