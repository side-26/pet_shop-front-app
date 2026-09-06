'use client';

import { useEditorState } from '@tiptap/react';
import { AlignCenterIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';

import type { TipTapTextAlignment } from '../../../plugins';
import { useTipTapActionsContext } from '../context';

const alignmentOptions = [
  { label: 'تراز راست', value: 'right' },
  { label: 'تراز وسط', value: 'center' },
  { label: 'تراز چپ', value: 'left' },
] as const;

function TipTapTextAlignAction() {
  const { editable, editor } = useTipTapActionsContext();
  const alignment = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return undefined;
      return ['left', 'center', 'right'].find((value) =>
        currentEditor.isActive({ textAlign: value }),
      ) as TipTapTextAlignment | undefined;
    },
  });

  return (
    <Select
      items={alignmentOptions}
      disabled={!editable || !editor}
      value={alignment ?? null}
      onValueChange={(nextAlignment) => {
        if (nextAlignment) {
          editor
            ?.chain()
            .focus()
            .setTextAlign(nextAlignment as TipTapTextAlignment)
            .run();
          return;
        }

        editor?.chain().focus().unsetTextAlign().run();
      }}
    >
      <SelectTrigger
        aria-label="تراز متن"
        className="tw:h-8 tw:w-36 tw:px-2 tw:text-label-m"
        prefixIcon={<AlignCenterIcon />}
      >
        <SelectValue placeholder="تراز متن" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {alignmentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { TipTapTextAlignAction };
