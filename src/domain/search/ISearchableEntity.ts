export interface ISearchableEntity {
  dateCreated: Date;
  dateUpdated: Date;
  dateDeleted: Date | null;
  dateSearchSync: Date | null;
}
