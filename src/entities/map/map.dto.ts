export type MapCoordinates = [number, number];

export const mapPluginPositions = ['top-right', 'top-left', 'bottom-left', 'bottom-right'] as const;

export type MapPluginPosition = (typeof mapPluginPositions)[number];
