import { deleteFavouriteCat, favouriteCat, updateCatVote } from '@/lib/api';
import { FavouriteCat, Vote } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { Router } from 'expo-router';
import { Alert } from 'react-native';


export const promptImageSelection = (
    showActionSheetWithOptions: any,
    userSelectImage: () => void,
    onCanceled: () => void
) =>
    showActionSheetWithOptions({
        options: ['Select from gallery', 'Cancel'],
    }, (index: number) => {
        switch (index) {
            case 0:
                userSelectImage();
                break;

            default:
                onCanceled?.();
                break;
        }
    })

export const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
    });

    if (!result.canceled) {
        return { uri: result.assets[0].uri, base64: result.assets[0].base64 };

    }
    return undefined;
};


export const getPermissionAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload an image.');
        return false;
    }
    return true;
};

export const isFavourite = (id: string, favouriteCats: any) =>
    favouriteCats?.some(
        (fav: FavouriteCat) => fav.image && fav.image.id === id
    ) || false;

export const handleToggleFavourite = async (
    id: string,
    isFavourite: boolean,
    favouriteCatsData: FavouriteCat[],
    refresh: () => void
) => {
    if (isFavourite) {
        await favouriteCat(id)
        Alert.alert('Cat added to favourites')
        refresh()
    }
    else {
        const item = favouriteCatsData.find((cat: FavouriteCat) => cat.image_id === id);
        if (item) {
            await deleteFavouriteCat(item.id)
            Alert.alert('Cat removed from favourites')
            refresh()

        }
    };
}

export function getCatScore(votes: Vote[] | undefined, imageId: string): number {
    if (!votes) return 0;
    const upvotes = votes.filter((vote) => vote.image_id === imageId && vote.value === 1).length;
    const downvotes = votes.filter((vote) => vote.image_id === imageId && vote.value === 0).length;
    return upvotes - downvotes;
}

export const handleUpVote = async (
    id: string,
    type: 'up' | 'down',
    catVoteData: Vote[],
    refetchCatVote: () => void
): Promise<void> => {
    const desiredValue = type === 'up' ? 1 : 0;

    const vote = catVoteData.find((vote) => vote.image_id === id);

    try {
        await updateCatVote(id, desiredValue);
        Alert.alert(`Cat ${type === 'up' ? 'upvoted' : 'downvoted'} successfully`);
        refetchCatVote();
    } catch (error) {
        Alert.alert('Error updating vote');
    }
};





