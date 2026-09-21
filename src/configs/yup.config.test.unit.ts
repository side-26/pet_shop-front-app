import { object, string } from 'yup';
import { describe, expect, it } from 'vitest';

import {
  yupLabel,
  yupLocalizationDictionary,
  yupMessage,
  yupMinimumLengthMessage,
  yupRequiredMessage,
} from './yup.config';

describe('Yup Persian localization', () => {
  it('resolves labels and domain messages from the shared dictionary', () => {
    expect(yupLabel('phoneNumber')).toBe(yupLocalizationDictionary.labels.phoneNumber);
    expect(yupMessage('invalidOtpCode')).toBe(yupLocalizationDictionary.messages.invalidOtpCode);
    expect(yupLocalizationDictionary.labels.petType).toBe('نوع حیوان');
  });

  it('uses localized field labels in default validation messages', async () => {
    const schema = object({ title: string().required().min(2) });

    await expect(schema.validate({})).rejects.toThrow(yupRequiredMessage('title'));
    await expect(schema.validate({ title: 'ا' })).rejects.toThrow(
      yupMinimumLengthMessage('title', 2),
    );
  });
});
