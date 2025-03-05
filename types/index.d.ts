export interface FavouriteCat {
  created_at: string;
  id: number;
  image: {
    id: string;
    url: string;
  } | null;
  image_id: string;
  sub_id: string | null;
  user_id: string;
}

export interface Vote {
  country_code: string;
  created_at: string;
  id: number;
  image: Record<string, unknown>;
  image_id: string;
  sub_id: string | null;
  value: number;
}

export type CardProps = {
  cat: {
    id: string;
    url: string;
    isFavourite: boolean;
    score?: number;
  };
  onFavourite: (id: string, isFavourite: boolean) => void;
  onVote: (id: string, type: 'up' | 'down') => void;
};