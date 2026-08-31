import { object, string } from 'yup';
import { describe, expect, it } from 'vitest';

import { yupLabel, yupLocalizationDictionary, yupMessage } from './yup.config';

describe('Yup Persian localization', () => {
  it('resolves labels and domain messages from the shared dictionary', () => {
    expect(yupLabel('phoneNumber')).toBe('شماره موبایل');
    expect(yupMessage('invalidOtpCode')).toBe('کد تأیید باید ۶ رقم باشد.');
    expect(yupLocalizationDictionary.labels.petType).toBe('نوع حیوان');
  });

  it('uses localized field labels in default validation messages', async () => {
    const schema = object({ title: string().required().min(2) });

    await expect(schema.validate({})).rejects.toThrow('عنوان الزامی است.');
    await expect(schema.validate({ title: 'ا' })).rejects.toThrow('عنوان باید حداقل ۲ نویسه باشد.');
  });
});
