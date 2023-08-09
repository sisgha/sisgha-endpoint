export interface IGenericListInput {
  query: string;

  limit: number;
  offset?: number;
  filter?: string;

  sort?: string[];
}
