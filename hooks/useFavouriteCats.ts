import { fetchCatVotes, fetchFavoriteCats } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useFavouriteCats() {
    return useQuery({
        queryKey: ['favouriteCats'],
        queryFn: fetchFavoriteCats, 
    });
}