// export class RelationalTableDescription {
//   addIndex(name: string, index: RelationalTableIndexDescription) {
//     this.indexArrayMap.add(name, index);
//   }
//
//   getIndex(name: string) {
//     return this.indexArrayMap.get(name);
//   }
//
//   dropIndex(name: string) {
//     this.indexArrayMap.remove(name);
//   }
//
//   addPrimaryKey(field: RelationalTableFieldDescription) {
//     this.primaryKeysArray.add(field.key, field);
//   }
//
//   dropPrimaryKey() {
//     this.primaryKeysArray.clear();
//   }
//
//   addField(name: string, field: RelationalTableFieldDescription) {
//     this.fieldArrayMap.add(name, field);
//   }
//
//   removeField(name: string) {
//     this.fieldArrayMap.remove(name);
//   }
//
//   addReference(name: string, ref: RelationalTableReferenceDescription) {
//     this.referenceArrayMap.add(name, ref);
//   }
//
//   dropReference(name: string) {
//     this.referenceArrayMap.remove(name);
//   }
//
//   // containsField(name: string): boolean {
//   //   return this.fieldArrayMap.exists(name);
//   // }
//   //
//   // reference(alias: string): RelationalTableReferenceDescription {
//   //   const reference = this.referenceArrayMap.get(alias);
//   //   if (!reference) {
//   //     throw new Error(`Unable to get reference ${alias} from table ${this.key}`);
//   //   }
//   //   return reference;
//   // }
//
//   private getKeyForSeed(seed: any) {
//     return this.primaryKeys
//       .map((primaryKey) => {
//         return seed[primaryKey.key] ?? '';
//       })
//       .join('-');
//   }
//
//   insertSeed(seedKeys: any, seed: any) {
//     const key = this.getKeyForSeed(seedKeys);
//     this.seedArrayMap.add(key, { key, seed, seedKeys });
//   }
//
//   deleteSeed(seedKeys: any) {
//     const key = this.getKeyForSeed(seedKeys);
//     this.seedArrayMap.remove(key);
//   }
//
//   updateSeed(seedKeys: any, seed: any) {
//     const key = this.getKeyForSeed(seedKeys);
//     this.seedArrayMap.update(key, { key, seed, seedKeys });
//   }
// }
