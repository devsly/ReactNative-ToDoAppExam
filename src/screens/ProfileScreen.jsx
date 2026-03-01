import { View, Text, Image, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';

import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebaseConfig';
import { uploadProfilePhoto } from '../services/storageService';
import { colors, spacing, fontSizes, borderRadius, button } from '../theme/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoURL(result.assets[0].uri);
    }
  }

  async function saveProfile() {
    try {
      setLoading(true);

      let finalPhotoURL = photoURL;

      // Ако е локален URI, upload-ваме в Storage
      if (photoURL && photoURL.startsWith('file://')) {
        finalPhotoURL = await uploadProfilePhoto(photoURL);
      }

      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: finalPhotoURL,
      });

      setPhotoURL(finalPhotoURL);
      setEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: photoURL || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />

        <Pressable style={styles.changePhotoBtn} onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </Pressable>

        {editing ? (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
          />
        ) : (
          <Text style={styles.name}>{user.displayName || 'Anonymous User'}</Text>
        )}

        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.actions}>
        {editing ? (
          <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={saveProfile}>
            <Text style={[styles.actionText, styles.primaryBtnText]}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Text>
          </Pressable>
        ) : (
          <Pressable style={styles.actionBtn} onPress={() => setEditing(true)}>
            <Text style={styles.actionText}>Edit Profile</Text>
          </Pressable>
        )}

        <Pressable style={[styles.actionBtn, styles.logoutBtn]} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm
  },
  name: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm
  },
  email: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
    color: colors.text,
  },
  actions: { marginTop: spacing.md },
  actionBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '600',
    color: colors.text
  },
  logoutBtn: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  },
  logoutText:
  {
    color: button.primary.color,
    fontWeight: '700'
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  primaryBtnText: {
    color: colors.textInverse ?? '#fff',
    fontWeight: '700',
  },
  changePhotoBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
    marginBottom: spacing.md,
  },

  changePhotoText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSizes.sm,
  },
};
