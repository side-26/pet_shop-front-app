import { PetListDescriptionCard } from './pet-list-description-card';

const petListDescription =
  'در پت شاپ پرشین می‌توانید انواع حیوانات خانگی را بر اساس نوع، نژاد، سن و ویژگی‌های مختلف بررسی و انتخاب کنید. مجموعه‌ای از سگ، گربه و سایر پت‌های محبوب با اطلاعات کامل، تصاویر، مشخصات نژاد و قیمت در دسترس شماست تا انتخابی آگاهانه داشته باشید. اگر به دنبال خرید سگ، خرید گربه یا انتخاب حیوان خانگی مناسب هستید، پت شاپ پرشین با امکان مقایسه گزینه‌ها، مشاهده جزئیات و جست‌وجوی آسان، مسیر پیدا کردن و خرید پت موردنظر شما را ساده‌تر و مطمئن‌تر می‌کند.';

/** Server-rendered SEO copy displayed after the final pet-list page. */
export function PetListDescription() {
  return (
    <section aria-labelledby="pet-list-description-title" className="tw:py-2">
      <PetListDescriptionCard>
        <h2 id="pet-list-description-title" className="tw:text-title-s">
          راهنمای انتخاب و خرید حیوانات خانگی
        </h2>
        <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{petListDescription}</p>
      </PetListDescriptionCard>
    </section>
  );
}
