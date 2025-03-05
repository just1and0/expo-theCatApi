import { fetchUploadedCats } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useGetCats() {
    return useInfiniteQuery({
        queryKey: ['cats'],
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            fetchUploadedCats(pageParam),
        getNextPageParam: (lastPage: any, pages: any[]) =>
            lastPage.length === 10 ? pages.length : undefined,
        initialPageParam: 0,
    });
}