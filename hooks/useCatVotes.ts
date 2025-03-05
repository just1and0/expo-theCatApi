import { fetchCatVotes } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useCatVotes() {
    return useQuery({
        queryKey: ['CatVotes'],
        queryFn: fetchCatVotes, 
    });
}

