import { View, Text, TextInput, Pressable, Image, Platform,KeyboardAvoidingView,ScrollView  } from 'react-native';
import { useState } from 'react';
import { addTask, updateTask } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { colors, spacing, fontSizes, borderRadius, priorityColors,button } from '../../theme/theme';
import { uploadTaskImage } from '../../services/storageService';


export default function AddTaskScreen({navigation}) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [dueDate, setDueDate] = useState(null); // нов state за крайния срок
  const [showDatePicker, setShowDatePicker] = useState(false);

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



  async function handleSave() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setLoading(true);

      const taskData = {
         title,
          description,
          priority,
          isDone: false,
  };

    if (dueDate) {
      taskData.dueDate = dueDate.getTime();
    }

const taskId = await addTask(user.uid, taskData);

      

      if (imageUri) {
        const imageUrl = await uploadTaskImage(imageUri, taskId);
        await updateTask(taskId, { imageUrl });
      }
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >

    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

     
  <Pressable style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
  <Text style={styles.dateBtnText}>
     {dueDate
    ? `End Date: ${dueDate.toLocaleDateString()}`
    : 'Add End Date (optional)'} 
  </Text>
</Pressable>

{dueDate && (
  <Pressable
    style={styles.removeDateBtn}
    onPress={() => setDueDate(null)} 
  >
    <Text style={styles.removeDateText}>Remove due date</Text>
  </Pressable>
)}

  <DateTimePickerModal
    isVisible={showDatePicker}
    mode="date"
    date={dueDate || new Date()}
    onConfirm={handleDateChange}
    onCancel={handleCancel}
  />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Pressable style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>
          {imageUri ? 'Change Image' : 'Pick Image'}
        </Text>
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

      <Pressable style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>
          {loading ? 'Saving...' : 'Save Task'}
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
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
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
  low: { backgroundColor: priorityColors.low },
  medium: { backgroundColor: priorityColors.medium },
  high: { backgroundColor: priorityColors.high },
  activePriority: {
    opacity: 0.85,
  },
  saveBtn: {
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
  dateBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.secondary,
  },
  dateBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
  scrollContent: {
  padding: spacing.md,
  paddingBottom: spacing.xl * 3, // вместо 120
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

