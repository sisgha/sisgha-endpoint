export type IAppResourceSearchOptions<IResourceModel = unknown> = null | {
  meiliSearchIndex: string;
  searchable: readonly (keyof IResourceModel | string)[];
  filterable: readonly (keyof IResourceModel | string)[];
  sortable: readonly (keyof IResourceModel | string)[];
};
