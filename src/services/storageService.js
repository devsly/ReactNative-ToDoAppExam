import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from './firebaseConfig';

const storage = getStorage();

// Upload profile photo and return download URL
export async function uploadProfilePhoto(localUri) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const response = await fetch(localUri);
    const blob = await response.blob();

    const photoRef = ref(storage, `profilePhotos/${user.uid}.jpg`);

    await uploadBytes(photoRef, blob);

    return await getDownloadURL(photoRef);
}

// Upload task image and return download URL
export async function uploadTaskImage(localUri, taskId) {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const imageRef = ref(
        storage,
        `tasks/${auth.currentUser.uid}/${taskId}.jpg`
    );

    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
}

// Delete task image
export async function deleteTaskImage(taskId) {
    try {
        const imageRef = ref(
            storage,
            `tasks/${auth.currentUser.uid}/${taskId}.jpg`
        );

        await deleteObject(imageRef);
    } catch (err) {
        // ако няма снимка – НЕ чупи delete task
        if (err.code !== 'storage/object-not-found') {
            throw err;
        }
    }
}


