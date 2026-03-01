
import { useState, useCallback  } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { fetchTasks, updateTaskStatus } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, fontSizes, borderRadius, priorityColors, button } from '../../theme/theme';


export default function TaskListScreen({ navigation }) {

  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function loadTasks() {
    try {
      setError(null);
      const data = await fetchTasks(user.uid);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  function onRefresh() {
    setRefreshing(true);
    loadTasks();
  }

  async function toggleTaskStatus(taskId, currentStatus) {

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, isDone: !currentStatus }
          : task
      )
    );

    try {
      await updateTaskStatus(taskId, !currentStatus);
    } catch (err) {
      // Rollback при грешка
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, isDone: currentStatus }
            : task
        )
      );

      alert('Failed to update task status');
    }
  }


  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayStartTs = startOfToday.getTime();

  function isOverdue(task) {
    return !task.isDone && task.dueDate && task.dueDate < todayStartTs;
  }


  function renderTaskItem({ item }) {
    const overdue = isOverdue(item);

    return (
      <View style={[styles.taskRow, item.isDone && styles.completedTask, overdue && styles.overdueTask]}>

        {/* ЛЯВА ЧАСТ – натискаема */}
        <Pressable
          style={styles.taskContent}
          onPress={() =>
            navigation.navigate('TaskDetails', { taskId: item.id })
          }
        >
          <Text style={[
            styles.taskTitle,
            item.isDone && styles.completedText
          ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >{item.title}</Text>

          {item.dueDate && (
            <Text style={styles.taskDate}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          )}

          <View style={styles.row}>
            <Text style={[styles.priority, styles[item.priority]]}>
              {item.priority.toUpperCase()}
            </Text>
            {overdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueBadgeText}>OVERDUE</Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* ДЯСНА ЧАСТ – Switch (НЕ е в Pressable) */}
        <Switch
          value={item.isDone || false}
          onValueChange={() =>
            toggleTaskStatus(item.id, item.isDone || false)
          }
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={item.isDone ? '#fff' : '#f4f3f4'}
        />

      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },

  heading: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },

  list: {
    paddingBottom: spacing.xl,
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.secondary,
  },

  completedTask: {
    backgroundColor: colors.success + '22', // лек success фон
    borderColor: colors.success,
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },

  overdueTask: {
    borderColor: colors.danger,
  },

  taskContent: {
    flex: 1,
    marginRight: spacing.sm,
  },

  taskTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },

  taskDate: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },

  priority: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },

  high: {
    color: priorityColors.high,
  },
  medium: {
    color: priorityColors.medium,
  },
  low: {
    color: priorityColors.low,
  },

  overdueBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginLeft: spacing.sm,
  },

  overdueBadgeText: {
    color: button.primary.color,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },

  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  addButtonText: {
    color: button.primary.color,
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    lineHeight: fontSizes.xxl,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

