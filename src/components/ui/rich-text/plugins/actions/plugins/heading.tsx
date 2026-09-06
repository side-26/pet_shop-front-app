'use client';

import { useEditorState } from '@tiptap/react';
import { HeadingIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';

import { useTipTapActionsContext } from '../context';

const headingOptions = [
  { label: 'پاراگراف', value: 'paragraph' },
  { label: 'پاراگراف کوچک', value: 'paragraph-small' },
  { label: 'عنوان ۱', value: '1' },
  { label: 'عنوان ۲', value: '2' },
  { label: 'عنوان ۳', value: '3' },
  { label: 'عنوان ۴', value: '4' },
  { label: 'عنوان ۵', value: '5' },
] as const;

function TipTapHeadingAction() {
  const { editable, editor } = useTipTapActionsContext();
  const heading = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return 'paragraph';
      if (currentEditor.isActive('heading', { level: 1 })) return '1';
      if (currentEditor.isActive('heading', { level: 2 })) return '2';
      if (currentEditor.isActive('heading', { level: 3 })) return '3';
      if (currentEditor.isActive('heading', { level: 4 })) return '4';
      if (currentEditor.isActive('heading', { level: 5 })) return '5';
      if (currentEditor.isActive('paragraph', { typographyScale: 'body-s' })) {
        return 'paragraph-small';
      }
      return 'paragraph';
    },
  });

  return (
    <Select
      items={headingOptions}
      disabled={!editable || !editor}
      value={heading ?? 'paragraph'}
      onValueChange={(nextHeading) => {
        if (nextHeading && nextHeading !== 'paragraph' && nextHeading !== 'paragraph-small') {
          const typographyScale =
            nextHeading === '4' ? 'heading-4' : nextHeading === '5' ? 'heading-5' : null;
          editor
            ?.chain()
            .focus()
            .setHeading({ level: Number(nextHeading) as 1 | 2 | 3 | 4 | 5 })
            .updateAttributes('heading', { typographyScale })
            .run();
          return;
        }

        editor
          ?.chain()
          .focus()
          .setParagraph()
          .updateAttributes('paragraph', {
            typographyScale: nextHeading === 'paragraph-small' ? 'body-s' : null,
          })
          .run();
      }}
    >
      <SelectTrigger
        aria-label="سطح متن"
        className="tw:h-8 tw:w-40 tw:px-2 tw:text-label-m"
        prefixIcon={<HeadingIcon />}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {headingOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { TipTapHeadingAction };
