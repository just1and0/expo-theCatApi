import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import en from '@/constants/en';
import { CardProps } from '@/types';

export function Card({
  cat, onFavourite, onVote
}: CardProps) {

  const [isFavourite, setIsFavourite] = useState(cat.isFavourite);
  const [score, setScore] = useState(cat.score || 0);

  const handleFavourite = () => {
    setIsFavourite(!isFavourite);
    onFavourite(cat.id, !isFavourite);
  };

  const handleVote = (type: 'up' | 'down') => {
    const newScore = type === 'up' ? score + 1 : score - 1;
    setScore(newScore);
    onVote(cat.id, type);
  };

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View style={styles.card}>
      <Image source={cat.url} style={styles.image} placeholder={{ blurhash }} transition={1000} />
      <View style={styles.info}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleFavourite} style={styles.button}>
          <Text style={styles.buttonText}>{isFavourite ? en.CARD.UNFAVOURITE : en.CARD.FAVOURITE}</Text>
        </TouchableOpacity>
        <View style={styles.voteContainer}>
          <TouchableOpacity onPress={() => handleVote('up')} style={styles.voteButton}>
            <Text style={styles.voteText}>{en.CARD.VOTE_UP}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVote('down')} style={styles.voteButton}>
            <Text style={styles.voteText}>{en.CARD.VOTE_DOWN}</Text>
          </TouchableOpacity> 
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  info: {
    marginBottom: 12,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#ff7f50',
    borderColor: '#ff7f50',
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    padding: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  voteText: {
    fontSize: 18,
  },
});
