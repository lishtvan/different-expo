import { sortItems } from 'constants/filter';
import {
  useRange,
  useRefinementList,
  useSortBy,
  useToggleRefinement,
} from 'react-instantsearch-core';

const VirtualFilter = () => {
  useRefinementList({ attribute: 'category' });
  useRefinementList({ attribute: 'designer' });
  useRefinementList({ attribute: 'size' });
  useRefinementList({ attribute: 'condition' });
  useRefinementList({ attribute: 'status' });
  useRefinementList({ attribute: 'tags' });
  useSortBy({ items: sortItems });
  useToggleRefinement({ attribute: 'status', on: 'SOLD', off: 'AVAILABLE' });
  useRange({ attribute: 'price' });

  return null;
};

export default VirtualFilter;
