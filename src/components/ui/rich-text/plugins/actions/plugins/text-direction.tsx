'use client';

import { useEditorState } from '@tiptap/react';
import { LanguagesIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';

import type { TipTapTextDirection } from '../../../plugins';
import { useTipTapActionsContext } from '../context';

const textDirectionOptions = [
  { label: 'تشخیص خودکار', value: 'auto' },
  { label: 'راست‌به‌چپ', value: 'rtl' },
  { label: 'چپ‌به‌راست', value: 'ltr' },
] as const;

function TipTapTextDirectionAction() {
  const { editable, editor } = useTipTapActionsContext();
  const textDirection = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return 'auto';
      return (
        (['auto', 'rtl', 'ltr'].find((value) => currentEditor.isActive({ dir: value })) as
          TipTapTextDirection | undefined) ??
        currentEditor.options.textDirection ??
        'auto'
      );
    },
  });

  return (
    <Select
      items={textDirectionOptions}
      disabled={!editable || !editor}
      value={textDirection ?? 'auto'}
      onValueChange={(nextTextDirection) => {
        editor
          ?.chain()
          .focus()
          .setTextDirection((nextTextDirection ?? 'auto') as TipTapTextDirection)
          .run();
      }}
    >
      <SelectTrigger
        aria-label="جهت متن"
        className="tw:h-8 tw:w-40 tw:px-2 tw:text-label-m"
        prefixIcon={<LanguagesIcon />}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {textDirectionOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { TipTapTextDirectionAction };
