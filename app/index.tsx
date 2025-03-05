import { SafeAreaView, View, FlatList, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useFavouriteCats } from '@/hooks/useFavouriteCats';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import useColors from '@/hooks/useColor';
import { getCatScore, handleToggleFavourite, handleUpVote, isFavourite } from '@/utils/utils';
import { Spinner } from '@/components/Spinner';
import { useCatVotes } from '@/hooks/useCatVotes';
import { useGetCats } from '@/hooks/useGetCats';
import en from '@/constants/en';

export default function HomePage() {
    const color = useColors();

    const { data, isLoading, refetch: refetchCats, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, } = useGetCats();
    const { data: favouriteCatsData, isLoading: favLoading, refetch: refetchFavouriteCat } = useFavouriteCats();
    const { data: catVoteData, isLoading: catVoteLoading, refetch: refetchCatVote } = useCatVotes();

    const cats = data ? data.pages.flat() : [];

    const refresh = () => {
        refetchCats()
        refetchFavouriteCat()
        refetchCatVote()
    }

    useFocusEffect(() => { refetchCats() });

    if (isLoading || favLoading || catVoteLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={cats}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<EmptyState onUpload={() => router.push('/upload')} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) =>
                (
                    <Card
                        key={item.id}
                        cat={{
                            id: item.id,
                            url: item.url,
                            isFavourite: isFavourite(item.id, favouriteCatsData),
                            score: getCatScore(catVoteData, item.id),
                        }}
                        onFavourite={(id, isFavourite) =>
                            handleToggleFavourite(
                                id,
                                isFavourite,
                                favouriteCatsData,
                                refresh
                            )
                        }
                        onVote={(id, type) => {
                            handleUpVote(id, type, catVoteData, refetchCatVote)
                        }}
                    />
                )
                }
                refreshing={isFetching && !isFetchingNextPage}
                onRefresh={refresh}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? (<ActivityIndicator size="large" color={color.surface} />) : null}
            />
            {cats.length > 0 && <View style={{ paddingHorizontal: 15, }}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/upload')}>
                    <Text style={styles.buttonText}>{en.UPLOAD_BUTTON.UPLOAD}</Text>
                </TouchableOpacity>
            </View>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ff7f50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
