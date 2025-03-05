import { useEffect, useState } from 'react';
import { View, Image, Alert, Text, ActivityIndicator } from 'react-native';

import { useRouter } from 'expo-router';
import { getPermissionAsync, pickImage, promptImageSelection } from '@/utils/utils';
import { useActionSheet } from '@expo/react-native-action-sheet';
import useColors from '@/hooks/useColor';


const API_KEY = `${process.env.EXPO_PUBLIC_CAT_API_KEY}`;
const UPLOAD_URL = `${process.env.EXPO_PUBLIC_BASE_URL}images/upload`;

export default function UploadPage() {
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const router = useRouter();
    const color = useColors();
    const { showActionSheetWithOptions } = useActionSheet();

    // show prompt on component mount
    useEffect(() => {
        getPermissionAsync()
        promptImageSelection(showActionSheetWithOptions, userSelectImage, () => router.back())
    }, []);

    const userSelectImage = async () => {
        const imageUri = await pickImage();
        if (imageUri) {
            setImage(imageUri.uri);
            uploadImage(imageUri.uri);
        } else {
            Alert.alert('No image selected', 'Please select an image first.');
            router.back();
        }
    };


    const uploadImage = async (imageUri: string) => {
        if (!imageUri) {
            Alert.alert('No image selected', 'Please select an image first.');
            return;
        }
        setIsUploading(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append("x-api-key", API_KEY);
            myHeaders.append("Content-Type", "multipart/form-data");

            const formdata = new FormData();
            // Extract file type from the URI (e.g., "jpg", "png")
            const fileType = imageUri.substring(imageUri.lastIndexOf('.') + 1);
            // Instead of converting the URI to a blob, we append an object with uri, name, and type
            formdata.append("file", {
                uri: imageUri,
                name: `image.${fileType}`,
                type: `image/${fileType}`
            } as any);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
            };

            const response = await fetch(UPLOAD_URL, requestOptions);
            const result = await response.json();
            if (result.approved) {
                Alert.alert('Success', 'Image uploaded successfully!');
                router.back();
            }

            if (!result.approved) {
                Alert.alert('Error', result.message);
                router.back();
            }
        } catch (error: any) {
            Alert.alert('Error', `${error.message}`);
            router.back();
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200, marginBottom: 10 }}
                />
            )}
            {!image && <ActivityIndicator size="large" style={{ flex: 1 }} color={color.surface} />}
            {isUploading && <View style={{ flex: 1, alignItems: 'center', }}>
                <ActivityIndicator size="large" color={color.surface} />
                <Text style={{ color: color.surface }}>Uploading...</Text>
            </View>}
        </View>
    );
}


