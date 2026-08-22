import { Camera, Mail, Phone, Send } from 'lucide-react';

import { Brand } from './brand';

const usefulLinks = ['درباره ما', 'تماس با ما', 'سؤالات متداول', 'قوانین و مقررات'] as const;

export function DefaultFooter() {
  return (
    <footer className="tw:mt-12 tw:rounded-t-3xl tw:bg-muted tw:text-foreground tw:md:mt-16">
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-7xl tw:grid-cols-1 tw:gap-10 tw:px-4 tw:py-10 tw:text-center tw:sm:px-6 tw:md:px-8 tw:md:py-12 tw:lg:grid-cols-[1.2fr_1fr] tw:lg:gap-12 tw:lg:text-start">
        <div className="tw:flex tw:flex-col tw:items-center tw:gap-5 tw:lg:items-start">
          <Brand />
          <p className="tw:max-w-md tw:text-body-s tw:text-muted-foreground tw:sm:text-body-m">
            پلتفرم جامع خدمات و محصولات حیوانات خانگی؛ برای اینکه انتخاب‌های مطمئن‌تر و لحظه‌های
            آرام‌تری کنار دوست پشمالوی خود داشته باشید.
          </p>
          <div className="tw:flex tw:items-center tw:gap-2" aria-label="شبکه‌های اجتماعی">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام پناهگاه پرشین"
              className="tw:flex tw:size-10 tw:items-center tw:justify-center tw:rounded-xl tw:text-primary tw:outline-none tw:transition-[background-color,color,transform] tw:hover:-translate-y-0.5 tw:hover:bg-primary tw:hover:text-primary-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
            >
              <Camera aria-hidden="true" className="tw:size-5" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              aria-label="تلگرام پناهگاه پرشین"
              className="tw:flex tw:size-10 tw:items-center tw:justify-center tw:rounded-xl tw:text-primary tw:outline-none tw:transition-[background-color,color,transform] tw:hover:-translate-y-0.5 tw:hover:bg-primary tw:hover:text-primary-foreground tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
            >
              <Send aria-hidden="true" className="tw:size-5" />
            </a>
          </div>
        </div>

        <div className="tw:grid tw:grid-cols-1 tw:gap-8 tw:sm:grid-cols-2">
          <section aria-labelledby="footer-useful-links">
            <h2
              id="footer-useful-links"
              className="tw:text-title-s tw:sm:text-title-m tw:lg:text-title-l"
            >
              لینک‌های مفید
            </h2>
            <ul className="tw:mt-4 tw:flex tw:flex-col tw:gap-2.5 tw:text-body-s tw:text-muted-foreground tw:sm:text-body-m">
              {usefulLinks.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="tw:text-title-s tw:sm:text-title-m tw:lg:text-title-l"
            >
              ارتباط با ما
            </h2>
            <ul className="tw:mt-4 tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-body-s tw:text-muted-foreground tw:sm:text-body-m tw:lg:items-start">
              <li className="tw:flex tw:items-center tw:gap-2">
                <Phone aria-hidden="true" className="tw:size-4 tw:shrink-0" />
                <bdi dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</bdi>
              </li>
              <li className="tw:flex tw:items-center tw:gap-2">
                <Mail aria-hidden="true" className="tw:size-4 tw:shrink-0" />
                <bdi dir="ltr">info@persianpet.com</bdi>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div className="tw:border-t tw:border-border/70 tw:px-4 tw:py-4 tw:text-center tw:text-caption tw:text-muted-foreground">
        تمامی حقوق برای پناهگاه حیوانات پرشین محفوظ است.
      </div>
    </footer>
  );
}
