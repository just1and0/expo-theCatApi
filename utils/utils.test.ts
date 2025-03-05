import { Alert } from 'react-native';
import { promptImageSelection, pickImage, isFavourite, handleToggleFavourite, getCatScore, handleUpVote } from './utils';
import * as ImagePicker from 'expo-image-picker';
import * as api from '@/lib/api';
import { FavouriteCat, Vote } from '@/types';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));


describe('promptImageSelection', () => {
  let showActionSheetWithOptionsMock: jest.Mock;
  let userSelectImageMock: jest.Mock;
  let onCanceledMock: jest.Mock;

  beforeEach(() => {
    showActionSheetWithOptionsMock = jest.fn();
    userSelectImageMock = jest.fn();
    onCanceledMock = jest.fn();
  });

  it('calls userSelectImage when index is 0', () => { 
    promptImageSelection(showActionSheetWithOptionsMock, userSelectImageMock, onCanceledMock);
 
    const callback = showActionSheetWithOptionsMock.mock.calls[0][1];
 
    callback(0);
 
    expect(userSelectImageMock).toHaveBeenCalled();
    expect(onCanceledMock).not.toHaveBeenCalled();
  });

  it('calls onCanceled when index is not 0', () => {
    promptImageSelection(showActionSheetWithOptionsMock, userSelectImageMock, onCanceledMock);
    const callback = showActionSheetWithOptionsMock.mock.calls[0][1];
 
    callback(1);
 
    expect(onCanceledMock).toHaveBeenCalled();
    expect(userSelectImageMock).not.toHaveBeenCalled();
  });
});

describe('pickImage', () => {
  it('returns the image data when an image is picked', async () => {
    const mockUri = 'test-image-uri';
    const mockBase64 = 'sample-base64-string';

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: mockUri, base64: mockBase64 }],
    });

    const result = await pickImage();

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    expect(result).toEqual({ uri: mockUri, base64: mockBase64 });
  });

  it('returns undefined when image picking is canceled', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: true,
      assets: [],
    });

    const result = await pickImage();

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    expect(result).toBeUndefined();
  });
});


describe('isFavourite', () => {
  it('should return false if favouriteCats is undefined', () => {
    expect(isFavourite('abc', undefined)).toBe(false);
  });

  it('should return false if favouriteCats is an empty array', () => {
    expect(isFavourite('abc', [])).toBe(false);
  });

  it('should return true if favouriteCats contains a cat with matching image.id', () => {
    const favouriteCats: FavouriteCat[] = [
      {
        created_at: "2025-03-05T12:27:20.000Z",
        id: 1,
        image: { id: 'abc', url: 'https://example.com/cat1.png' },
        image_id: 'abc',
        sub_id: 'my-user-1234',
        user_id: 'g7e47k'
      }
    ];
    expect(isFavourite('abc', favouriteCats)).toBe(true);
  });

  it('should return false if favouriteCats does not contain a matching image.id', () => {
    const favouriteCats: FavouriteCat[] = [
      {
        created_at: "2025-03-05T12:27:20.000Z",
        id: 1,
        image: { id: 'def', url: 'https://example.com/cat2.png' },
        image_id: 'def',
        sub_id: 'my-user-1234',
        user_id: 'g7e47k'
      }
    ];
    expect(isFavourite('abc', favouriteCats)).toBe(false);
  });

  it('should return false if fav.image is null', () => {
    const favouriteCats: FavouriteCat[] = [
      {
        created_at: "2025-03-05T12:27:20.000Z",
        id: 1,
        image: null,
        image_id: '',
        sub_id: 'my-user-1234',
        user_id: 'g7e47k'
      }
    ];
    expect(isFavourite('abc', favouriteCats)).toBe(false);
  });
});


describe('handleToggleFavourite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a cat to favourites when isFavourite is true', async () => {
    const catId = 'abc';
    const favouriteCatsData: FavouriteCat[] = [];
    const refreshMock = jest.fn();

    const favouriteCatSpy = jest
      .spyOn(api, 'favouriteCat')
      .mockResolvedValue({});
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation(() => { });

    await handleToggleFavourite(catId, true, favouriteCatsData, refreshMock);

    expect(favouriteCatSpy).toHaveBeenCalledWith(catId);
    expect(alertSpy).toHaveBeenCalledWith('Cat added to favourites');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('should remove a cat from favourites when isFavourite is false and cat is found', async () => {
    const catId = 'abc';
    const favouriteCatsData: FavouriteCat[] = [
      {
        created_at: '2025-03-05T12:27:41.000Z',
        id: 1,
        image: { id: 'abc', url: 'https://example.com/cat.png' },
        image_id: 'abc',
        sub_id: null,
        user_id: 'g7e47k',
      },
    ];
    const refreshMock = jest.fn();

    const deleteFavouriteCatSpy = jest
      .spyOn(api, 'deleteFavouriteCat')
      .mockResolvedValue({});
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation(() => { });

    await handleToggleFavourite(catId, false, favouriteCatsData, refreshMock);

    expect(deleteFavouriteCatSpy).toHaveBeenCalledWith(1);
    expect(alertSpy).toHaveBeenCalledWith('Cat removed from favourites');
    expect(refreshMock).toHaveBeenCalled();
  });

  it('should do nothing when isFavourite is false and cat is not found in favouriteCatsData', async () => {
    const catId = 'abc';
    const favouriteCatsData: FavouriteCat[] = []; // No matching cat
    const refreshMock = jest.fn();

    const deleteFavouriteCatSpy = jest
      .spyOn(api, 'deleteFavouriteCat')
      .mockResolvedValue({});
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation(() => { });

    await handleToggleFavourite(catId, false, favouriteCatsData, refreshMock);

    expect(deleteFavouriteCatSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
 

describe('getCatScore', () => {
  const votes: Vote[] = [
    {
      country_code: 'GB',
      created_at: '2025-03-05T15:55:33.000Z',
      id: 1255100,
      image: {},
      image_id: 'cat1',
      sub_id: 'my-user-1234',
      value: 0,
    },
    {
      country_code: 'GB',
      created_at: '2025-03-05T15:59:31.000Z',
      id: 1255101,
      image: { id: 'cat2', url: 'https://cdn2.thecatapi.com/images/cat2.png' },
      image_id: 'cat1',
      sub_id: null,
      value: 1,
    },
    {
      country_code: 'GB',
      created_at: '2025-03-05T15:59:47.000Z',
      id: 1255102,
      image: { id: 'cat2', url: 'https://cdn2.thecatapi.com/images/cat2.png' },
      image_id: 'cat1',
      sub_id: null,
      value: 1,
    },
    {
      country_code: 'GB',
      created_at: '2025-03-05T16:00:27.000Z',
      id: 1255103,
      image: { id: 'cat2', url: 'https://cdn2.thecatapi.com/images/cat2.png' },
      image_id: 'cat1',
      sub_id: null,
      value: 0,
    },
    // Votes for another cat
    {
      country_code: 'GB',
      created_at: '2025-03-05T16:01:00.000Z',
      id: 1255104,
      image: { id: 'cat3', url: 'https://cdn2.thecatapi.com/images/cat3.png' },
      image_id: 'cat2',
      sub_id: null,
      value: 1,
    },
  ];

  it('should return "0" when upvotes equal downvotes', () => {
    // For cat1: upvotes: 2, downvotes: 2 -> score: 0
    // (vote id 1255100: 0, id 1255101: 1, id 1255102: 1, id 1255103: 0)
    const score = getCatScore(votes, 'cat1');
    expect(score).toBe(0);
  });

  it('should return positive score when there are more upvotes than downvotes', () => {
    // For cat2: only one vote exists with value: 1, so score is 1
    const score = getCatScore(votes, 'cat2');
    expect(score).toBe(1);
  });

  it('should return negative score when there are more downvotes than upvotes', () => {
    // Create a test scenario where downvotes outnumber upvotes for cat3
    const testVotes: Vote[] = [
      { country_code: 'GB', created_at: '2025-03-05T15:55:33.000Z', id: 1, image: {}, image_id: 'cat3', sub_id: null, value: 0 },
      { country_code: 'GB', created_at: '2025-03-05T15:55:40.000Z', id: 2, image: {}, image_id: 'cat3', sub_id: null, value: 0 },
      { country_code: 'GB', created_at: '2025-03-05T15:55:50.000Z', id: 3, image: {}, image_id: 'cat3', sub_id: null, value: 1 },
    ];
    // For cat3: upvotes: 1, downvotes: 2 -> score: -1
    const score = getCatScore(testVotes, 'cat3');
    expect(score).toBe(-1);
  });

  it('should return "0" when there are no votes for the given image_id', () => {
    const score = getCatScore(votes, 'nonexistent');
    expect(score).toBe(0);
  });
});

describe('handleUpVote', () => {
  const id = 'test-id';
  const refetchCatVoteMock = jest.fn();

  const sampleVotes: Vote[] = [
    {
      country_code: 'GB',
      created_at: '2025-03-05T15:55:33.000Z',
      id: 1255100,
      image: {},
      image_id: 'other-id',
      sub_id: 'my-user-1234',
      value: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update vote successfully for an upvote', async () => { 
    const updateCatVoteSpy = jest
      .spyOn(api, 'updateCatVote')
      .mockResolvedValue({});
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
 
    await handleUpVote(id, 'up', sampleVotes, refetchCatVoteMock);
 
    expect(updateCatVoteSpy).toHaveBeenCalledWith(id, 1); 
    expect(alertSpy).toHaveBeenCalledWith('Cat upvoted successfully'); 
    expect(refetchCatVoteMock).toHaveBeenCalled();
  });

  it('should update vote successfully for a downvote', async () => { 
    const updateCatVoteSpy = jest
      .spyOn(api, 'updateCatVote')
      .mockResolvedValue({});
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
 
    await handleUpVote(id, 'down', sampleVotes, refetchCatVoteMock);
 
    expect(updateCatVoteSpy).toHaveBeenCalledWith(id, 0); 
    expect(alertSpy).toHaveBeenCalledWith('Cat downvoted successfully'); 
    expect(refetchCatVoteMock).toHaveBeenCalled();
  });

  it('should alert error when updateCatVote fails', async () => { 
    const updateCatVoteSpy = jest
      .spyOn(api, 'updateCatVote')
      .mockRejectedValue(new Error('Network Error'));
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
 
    await handleUpVote(id, 'up', sampleVotes, refetchCatVoteMock);
 
    expect(updateCatVoteSpy).toHaveBeenCalledWith(id, 1); 
    expect(alertSpy).toHaveBeenCalledWith('Error updating vote'); 
    expect(refetchCatVoteMock).not.toHaveBeenCalled();
  });
});
