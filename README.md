
#  React Native – Softuni Exam Project  
## Task Manager App


Author

Name: Slav Slavov

Course: React Native

Project Type: Exam Project


APK Download Link:

https://drive.google.com/file/d/1XDnX9ZcYTH7sPNCfAh_wdfX7qujhVZBZ/view?usp=sharing

🧪 Test Credentials

Email: test@test.com

Password: 123456


## Installation & Run Instructions

**Install dependencies**

npm install

**Start the application**

npx expo start

**Run on device**

Scan the QR code using Expo Go
OR
Run on Android Emulator


📁 Project Structure

src/

 ├── context/

 ├── navigation/

 ├── screens/

 ├── services/
 

**Notes**

The project uses a real backend (Firebase)

Data persistence is real and permanent

---

## 1. Project Overview

**Application Name:**  
Task Manager App

**Application Category / Topic:**  
Productivity

**Main Purpose:**  
The application is a task management mobile app that allows users to create, organize, and track their personal tasks. Users can add tasks with priorities, due dates, and optional images, mark tasks as completed, and manage their task list efficiently. The app helps users stay organized and keep track of deadlines.

---

## 2. User Access & Permissions

### Guest (Not Authenticated)

Unauthenticated users can access:
- Login screen
- Register screen

Guests **cannot**:
- View tasks
- Create, edit, or delete tasks
- Access profile information

---

### Authenticated User

Authenticated users can access:
- Task List screen
- Task Details screen
- Add Task screen
- Edit Task screen
- Profile screen

Authenticated users can:
- Create new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Upload images for tasks
- Update profile information (display name and profile photo)
- Logout

---

## 3. Authentication & Session Handling

### Authentication Flow

1. When the application starts, Firebase Authentication checks if a user session exists.
2. If a valid session is found, the user is automatically logged in.
3. If no session exists, the user is redirected to the Login screen.
4. On successful login or registration, the user is redirected to the main application screens.
5. On logout, the session is cleared and the user is redirected to the Login screen.

---

### Session Persistence

- User authentication state is handled entirely by Firebase Authentication.
- Firebase Auth persistence ensures the user remains logged in after app restart.
- No manual token storage is used.

---

## 4. Navigation Structure

### Root Navigation Logic

- The app uses conditional navigation based on authentication state.
- Unauthenticated users see the authentication stack (Login / Register).
- Authenticated users see the main application navigation.

---

### Main Navigation

- Bottom Tab Navigation is used for main sections:
  - Tasks
  - Profile

---

### Nested Navigation

- A Stack Navigator is nested inside the Tasks tab.
- Screens included:
  - Task List
  - Task Details
  - Add Task
  - Edit Task

---

## 5. List → Details Flow

### List / Overview Screen

- Displays a list of tasks created by the authenticated user.
- Each task shows:
  - Title
  - Priority
  - Due date (if available)
  - Completion status
- Users can:
  - Tap a task to view details
  - Toggle completion status directly from the list
  - Pull to refresh the list

---

### Details Screen

- Navigation is triggered by tapping a task in the list.
- The task ID is passed via route parameters.
- Full task information is displayed:
  - Title
  - Description
  - Priority
  - Due date
  - Image (if available)

---

## 6. Data Source & Backend

### Backend Type

- Real backend using Firebase:
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage

  ### Firebase Configuration

Firebase configuration is stored in environment variables using Expo public environment keys.  
This approach avoids hardcoding sensitive configuration values directly in the repository and follows recommended security practices for Expo projects.

---

### Data Operations (CRUD)

#### Read (GET)

- Tasks are fetched from Firestore based on the authenticated user ID.
- Task details are fetched by task ID.

#### Create (POST)

- Users can create new tasks using the Add Task screen.
- Tasks include title, description, priority, due date, and optional image.

#### Update / Delete (Mutation)

- Tasks can be updated (title, description, priority, due date, image).
- Tasks can be deleted from the Task Details screen.
- UI is updated immediately after successful operations.

---

## 7. Forms & Validation

### Forms Used

- Login form
- Register form
- Add Task form
- Edit Task form
- Profile edit form

---

### Validation Rules

- **Email**
  - Required
  - Must be a valid email format
- **Password**
  - Required
  - Minimum length of 6 characters
  - Must contain at least one number
- **Task Title**
  - Required
  - Cannot be empty

---

## 10. Native Device Features

### Used Native Feature(s)

- Image Picker (Gallery access)

---

### Usage Description

- Users can select images from their device gallery.
- Images are used for:
  - Task images
  - Profile photo
- Selected images are uploaded to Firebase Storage and linked to the corresponding data.

---

## 11. Typical User Flow

1. User opens the app.
2. User logs in or registers.
3. User views the task list.
4. User creates a new task with priority and due date.
5. User optionally uploads an image.
6. User marks tasks as completed or edits existing tasks.
7. User views and edits profile information.
8. User logs out.

---

## 12. Error & Edge Case Handling

- **Authentication errors**
  - Invalid credentials or registration errors are displayed via alerts.
- **Network or data errors**
  - Errors during data fetch or update are handled with user-friendly messages.
- **Empty states**
  - If no tasks exist, an empty state message is displayed.

---