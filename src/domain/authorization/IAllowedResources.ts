export type IAllowedResources<Id> =
  | {
      type: 'id_array';
      ids: Id[];
    }
  | {
      type: 'boolean';
      value: boolean;
    }
  | {
      type: 'null';
      value: null;
    };
