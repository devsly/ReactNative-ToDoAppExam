import { View, Text, TextInput, Pressable, Image, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getTaskById, updateTask } from '../../services/taskService';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, fontSizes, borderRadius, priorityColors, button } from '../../theme/theme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { uploadTaskImage } from '../../services/storageService';




export default function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);


  useEffect(() => {
    loadTask();
  }, []);

  async function loadTask() {
    try {
      const task = await getTaskById(taskId);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setImageUri(task.imageUrl || null);
      setDueDate(
        task.dueDate ? new Date(task.dueDate) : null
      );
    } catch (err) {
      alert('Failed to load task');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  const handleDateChange = (date) => {
    setDueDate(date);
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setShowDatePicker(false);
  };


  async function handleUpdate() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setSaving(true);

    const previousDueDate = dueDate;

    try {
      const updateData = {
        title,
        description,
        priority,
        updatedAt: new Date(),
        dueDate: dueDate ? dueDate.getTime() : null,
      };      

      await updateTask(taskId, updateData);
     
      if (imageUri && imageUri.startsWith('file://')) {
        const imageUrl = await uploadTaskImage(imageUri, taskId);
        await updateTask(taskId, { imageUrl });
      }

      navigation.goBack();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: 120, // ⬅️ важно за bottom tabs
        }}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.container}>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
          />

          <Pressable style={styles.saveBtn} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.saveBtnText}>
              {dueDate
                ? `End Date: ${dueDate.toLocaleDateString()}`
                : 'Add End Date (optional)'}
            </Text>
          </Pressable>

          {dueDate && (
            <Pressable
              onPress={() => setDueDate(null)}
              style={styles.removeDateBtn}
            >
              <Text style={styles.removeDateText}>
                Remove due date
              </Text>
            </Pressable>
          )}

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={dueDate || new Date()}
            onConfirm={handleDateChange}
            onCancel={handleCancel}
          />


          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}

          <Pressable style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>Change Image</Text>
          </Pressable>

          <View style={styles.priorityContainer}>
            {['low', 'medium', 'high'].map(p => (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityBtn,
                  styles[p],
                  priority === p && { opacity: 1 },
                  priority !== p && { opacity: 0.4 },
                ]}
              >
                <Text style={styles.priorityText} numberOfLines={1} adjustsFontSizeToFit>{p.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.saveBtn} onPress={handleUpdate}>
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    backgroundColor: colors.secondary,
    color: colors.text,
    marginBottom: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priorityBtn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  priorityText: {
    color: button.primary.color,
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
  low: {
    backgroundColor: priorityColors.low,
  },
  medium: {
    backgroundColor: priorityColors.medium,
  },
  high: {
    backgroundColor: priorityColors.high,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  imageBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imageBtnText: {
    fontWeight: '700',
    color: colors.primary,
  },
  saveBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    color: button.primary.color,
    fontWeight: '700',
    fontSize: fontSizes.lg,
  },
  removeDateBtn: {
    padding: spacing.md,
  borderRadius: borderRadius.md,
  borderWidth: 1,
  borderColor: colors.danger,
  alignItems: 'center',
  marginBottom: spacing.md,
  },

  removeDateText: {
    color: colors.danger,
    fontWeight: '700',
  },
};
