export enum IAuthorizationConstraintRecipeResolutionMode {
  CASL_ONLY = 'casl_only',
  MERGE = 'merge', // OR
  EXCLUDE = 'exclude', // NOT
  INTERSECTION = 'intersection', // AND
}
