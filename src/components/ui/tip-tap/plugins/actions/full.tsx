'use client';

import {
  TipTapHeadingAction,
  TipTapImageUploadAction,
  TipTapListAction,
  TipTapTextAlignAction,
  TipTapTextDirectionAction,
  type TipTapImageUploadActionProps,
} from './plugins';
import { TipTapHeaderActions } from './default';

function TipTapFullHeaderActions({ onUpload }: TipTapImageUploadActionProps) {
  return (
    <TipTapHeaderActions>
      <TipTapHeadingAction />
      <TipTapListAction />
      <TipTapTextAlignAction />
      <TipTapTextDirectionAction />
      <TipTapImageUploadAction onUpload={onUpload} />
    </TipTapHeaderActions>
  );
}

export { TipTapFullHeaderActions };
