import React, { SyntheticEvent } from 'react';
import { FCC } from '@cmrc/types/FCC';
import { SxProps } from '@mui/system';
import { RichTreeView } from '@mui/x-tree-view';

export interface TreeViewProps {
  items: any[];
  multiSelect?: boolean;
  checkboxSelection?: boolean;
  onSelectedItemsChange?: (event: SyntheticEvent, itemIds: string | string[]) => void;
  onItemSelectionToggle?: (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => void;
  sx?: SxProps;
  slots?: any
  selectedItems?: any
  defaultExpandedItems?: string[]
}

const TreeView: FCC<TreeViewProps> = ({
  items,
  multiSelect,
  checkboxSelection,
  onSelectedItemsChange,
  onItemSelectionToggle,
  sx,
  slots,
  selectedItems,
  defaultExpandedItems
}) => (
  <RichTreeView
    sx={sx}
    items={items}
    selectedItems={selectedItems}
    multiSelect={multiSelect}
    checkboxSelection={checkboxSelection}
    onItemSelectionToggle={onItemSelectionToggle}
    onSelectedItemsChange={onSelectedItemsChange}
    slots={slots}
    defaultExpandedItems={defaultExpandedItems}
  />
);

export default TreeView;
