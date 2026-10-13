import type {
  ArticleCatalogPetTypeDTO,
  ArticleTagResponse,
} from '@/entities/articles/articles.dto';

import { Separator } from '@/components/ui/separator';

import { ArticlesPetTypeFilterSection } from './articles-pet-type-filter-section';
import { ArticlesTagFilterSection } from './articles-tag-filter-section';

type ArticlesCatalogFilterControlsProps = Readonly<{
  disabled?: boolean;
  petTypes: readonly ArticleCatalogPetTypeDTO[];
  query: Readonly<Record<string, string>>;
  selectedTags: ReadonlySet<string>;
  tags: readonly ArticleTagResponse[];
  value?: string;
}>;

export function ArticlesCatalogFilterControls({
  disabled = false,
  petTypes,
  query,
  selectedTags,
  tags,
  value,
}: ArticlesCatalogFilterControlsProps) {
  return (
    <>
      <ArticlesTagFilterSection
        disabled={disabled}
        query={query}
        selectedTags={selectedTags}
        tags={tags}
      />
      <Separator className="tw:my-5" />
      <ArticlesPetTypeFilterSection
        disabled={disabled}
        petTypes={petTypes}
        query={query}
        value={value}
      />
    </>
  );
}
