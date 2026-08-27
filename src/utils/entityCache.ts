import { cacheTag, updateTag } from 'next/cache';

export class EntityTag {
  constructor(private readonly entityName: string) {}

  get all() {
    return this.entityName;
  }

  get list() {
    return `${this.entityName}:list`;
  }

  detail(id: string) {
    return `${this.entityName}:detail:${id}`;
  }

  query(key: string) {
    return `${this.entityName}:query:${key}`;
  }

  registerList(queryKey?: string) {
    cacheTag(this.all);
    cacheTag(this.list);

    if (queryKey) {
      cacheTag(this.query(queryKey));
    }
  }

  registerDetail(id: string) {
    cacheTag(this.all);
    cacheTag(this.detail(id));
  }

  invalidateAll() {
    updateTag(this.all);
  }

  invalidateList() {
    updateTag(this.list);
  }

  invalidateDetail(id: string) {
    updateTag(this.detail(id));
  }
}
