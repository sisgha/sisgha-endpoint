import { SearchResponse } from 'meilisearch';

export type SearchResult<T> = Pick<
  SearchResponse<T>,
  'query' | 'hits' | 'estimatedTotalHits' | 'limit' | 'estimatedTotalHits'
>;
