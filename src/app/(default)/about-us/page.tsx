import type { Metadata } from 'next';

import { AboutUsHero } from './_components/about-us-hero';
import { AboutUsStory } from './_components/about-us-story';

export const metadata: Metadata = {
  title: 'درباره ما | پت‌شاپ پرشین',
  description:
    'با داستان، ارزش‌ها و رویکرد پت‌شاپ پرشین برای مراقبت بهتر از حیوانات خانگی آشنا شوید.',
};

export const instant = true;

export default function AboutUsPage() {
  return (
    <article className="tw:overflow-clip">
      <AboutUsHero />
      <AboutUsStory />
    </article>
  );
}
