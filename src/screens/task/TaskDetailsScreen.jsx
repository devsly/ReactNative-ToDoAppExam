import { useState, useCallback, } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTaskById, deleteTask } from '../../services/taskService';
import { colors, spacing, fontSizes, borderRadius, priorityColors, button } from '../../theme/theme';
import { deleteTaskImage } from '../../services/storageService';


export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId } = route.params;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTask(); // функцията, която чете задачата от Firestore
    }, [])
  );

  async function loadTask() {
    try {
      const data = await getTaskById(taskId);
      setTask(data);
    } catch (error) {
      alert(error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTaskImage(taskId);
              await deleteTask(taskId);
              navigation.goBack();
            } catch (error) {
              alert(error.message);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!task) {
    return <ActivityIndicator />
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={[styles.priority, styles[task.priority]]}>
          {task.priority.toUpperCase()} PRIORITY
        </Text>

        {task.imageUrl && (
          <Image source={{ uri: task.imageUrl }} style={styles.image} />
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
        <Text style={styles.description}>End Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date set'}</Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('EditTask', { taskId: task.id })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = {
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  priority: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  high: { color: priorityColors.high },
  medium: { color: priorityColors.medium },
  low: { color: priorityColors.low },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.danger,
    marginLeft: spacing.xs,
    alignItems: 'center',
  },
  buttonText: {
    color: button.primary.color,
    fontWeight: '700',
  },
   scrollContent: {
    paddingBottom: spacing.xl,
  },
};
