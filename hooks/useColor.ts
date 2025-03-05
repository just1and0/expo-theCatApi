import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';   

const useColors = () => {
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? Colors.dark : Colors.light;
  
  return color;
};

export default useColors;
