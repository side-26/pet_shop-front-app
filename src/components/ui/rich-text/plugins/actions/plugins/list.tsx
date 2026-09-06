'use client';

import { useEditorState } from '@tiptap/react';
import { ListIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';

import { useTipTapActionsContext } from '../context';

const listOptions = [
  { label: 'بدون فهرست', value: 'none' },
  { label: 'فهرست نشانه‌دار', value: 'bullet' },
  { label: 'فهرست شماره‌دار', value: 'ordered' },
] as const;

function TipTapListAction() {
  const { editable, editor } = useTipTapActionsContext();
  const listType = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) return 'none';
      if (currentEditor.isActive('bulletList')) return 'bullet';
      if (currentEditor.isActive('orderedList')) return 'ordered';
      return 'none';
    },
  });

  return (
    <Select
      items={listOptions}
      disabled={!editable || !editor}
      value={listType ?? 'none'}
      onValueChange={(nextListType) => {
        if (nextListType === 'bullet' && !editor?.isActive('bulletList')) {
          editor?.chain().focus().toggleBulletList().run();
          return;
        }

        if (nextListType === 'ordered' && !editor?.isActive('orderedList')) {
          editor?.chain().focus().toggleOrderedList().run();
          return;
        }

        if (nextListType === 'none') {
          if (editor?.isActive('bulletList')) editor.chain().focus().toggleBulletList().run();
          if (editor?.isActive('orderedList')) editor.chain().focus().toggleOrderedList().run();
        }
      }}
    >
      <SelectTrigger
        aria-label="نوع فهرست"
        className="tw:h-8 tw:w-44 tw:px-2 tw:text-label-m"
        prefixIcon={<ListIcon />}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {listOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { TipTapListAction };
