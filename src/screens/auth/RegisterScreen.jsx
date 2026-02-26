import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  button,
} from '../../theme/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password');

  async function handleRegister(data) {
    try {
      await register(data.email, data.password);
    } catch (error) {
      alert(error.message);
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {/* EMAIL */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>

        {/* Password*/}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              validate: value =>
                /[0-9]/.test(value) ||
                'Password must contain at least one number',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

       {/* Confirm password */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm password is required',
              validate: value =>
                value === passwordValue || 'Passwords do not match',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Confirm your password"
                secureTextEntry
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <Pressable
          style={styles.registerBtn}
          onPress={handleSubmit(handleRegister)}
        >
          <Text style={styles.registerText}>Register</Text>
        </Pressable>

        <Pressable
          style={styles.linkContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>
            Already have an account? Login
          </Text>
        </Pressable>
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
    marginBottom: spacing.xs,
    textAlign: 'center',
    color: colors.text,
  },

  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  field: {
    marginBottom: spacing.md,
  },

  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: fontSizes.md,
    backgroundColor: colors.secondary,
    color: colors.text,
  },

  error: {
    color: colors.danger,
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
  },

  registerBtn: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: button.primary.backgroundColor,
    alignItems: 'center',
  },

  registerText: {
    color: button.primary.color,
    fontWeight: '700',
    fontSize: fontSizes.md,
  },

  linkContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },

  linkText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    paddingBottom: spacing.xl * 3, // вместо 120
    justifyContent: 'center',
  }
};
