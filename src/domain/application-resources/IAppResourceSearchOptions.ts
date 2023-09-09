export type IAppResourceSearchOptions<IResourceModel = unknown> = null | {
  meiliSearchIndex: string;
  searchable: readonly (keyof IResourceModel)[];
  filterable: readonly (keyof IResourceModel)[];
  sortable: readonly (keyof IResourceModel)[];
};
