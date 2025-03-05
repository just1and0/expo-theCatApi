import { useColorScheme } from 'react-native';
import { renderHook } from '@testing-library/react-hooks';
import useColors from './../useColor';
import { Colors } from '../../constants/Colors';

jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

const mockedUseColorScheme = jest.mocked(useColorScheme);

describe('useColors hook', () => {
  it('returns dark colors when the scheme is dark', () => {
    mockedUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useColors());
    expect(result.current).toEqual(Colors.dark);
  });

  it('returns light colors when the scheme is light', () => {
    mockedUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useColors());
    expect(result.current).toEqual(Colors.light);
  });

  it('returns light colors when the scheme is undefined', () => {
    mockedUseColorScheme.mockReturnValue(undefined);
    const { result } = renderHook(() => useColors());
    expect(result.current).toEqual(Colors.light);
  });
});
