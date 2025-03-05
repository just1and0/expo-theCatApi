import * as React from 'react';
import renderer from 'react-test-renderer';

import { EmptyState } from '../EmptyState';

it(`renders correctly`, () => {
  const tree = renderer.create(
    <EmptyState
      onUpload={() => null} />).toJSON();

  expect(tree).toMatchSnapshot();
});
