import * as React from 'react';
import renderer from 'react-test-renderer';

import { Card } from '../Card';

it(`renders correctly`, () => {
  const tree = renderer.create(
    <Card cat={{
      id: '1',
      url: 'link-to-image',
      isFavourite: false,
      score: 0
    }} onFavourite={function (id: string, isFavourite: boolean): void {

    }} onVote={function (id: string, type: 'up' | 'down'): void {

    }}
    />).toJSON();

  expect(tree).toMatchSnapshot();
});
