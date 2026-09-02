---
name: thumbnail-image-placeholders
description: Use a related thumbnail image as an image component's data URL and loading placeholder when displaying an image with a thumbnail field.
---

# Thumbnail Image Placeholders

When an image record exposes a corresponding thumbnail (for example, `thumbnail`,
`mainImageThumbnail`, or `mainThumbnailImage`), use that thumbnail for the
image's low-resolution visual state.

- Pass the thumbnail as the component's `dataUrl`/placeholder prop when that API
  is available. Keep the full-size image as the primary `src`.
- For visual primitives that do not provide a dedicated placeholder prop, render
  the thumbnail as the fallback background image or equivalent loading surface.
- Preserve the thumbnail value in DTO-to-view-model mapping; do not substitute
  the full-size image or discard the thumbnail before rendering.
- If no related thumbnail exists, retain the component's established fallback
  behavior. Do not manufacture a data URL or add a separate image request.
- Keep alt text and other accessibility behavior tied to the primary image's
  content, not to the thumbnail implementation detail.

In this project, the admin tables commonly apply this through `Avatar`: the
full image is `AvatarImage.src`, while the thumbnail is the `Avatar` background
image. Follow the existing component contract when a different image primitive
is used.
