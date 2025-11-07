export type DropdownOpenStrategy = 'click' | 'hover';

export type DropdownPanelPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

export type DropdownTriggerVariant = 'solid' | 'soft' | 'ghost' | 'icon';

export type DropdownTriggerSize = 'sm' | 'md';

export interface DropdownTriggerConfig {
  label?: string;
  leadingIcon?: DropdownIconName;
  trailingIcon?: DropdownIconName;
  variant?: DropdownTriggerVariant;
  size?: DropdownTriggerSize;
  fullWidth?: boolean;
  shape?: 'rounded' | 'pill' | 'circle';
  ariaLabel?: string;
}

export type DropdownIconName =
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'dots-vertical'
  | 'dots-horizontal'
  | 'plus'
  | 'minus'
  | 'search';

export type DropdownIntent = 'default' | 'accent' | 'danger';

export interface DropdownAvatar {
  name: string;
  imageUrl?: string;
  initials?: string;
}

export interface DropdownHeader {
  title: string;
  subtitle?: string;
  avatar?: DropdownAvatar;
  helperText?: string;
}

export interface DropdownFooterAction {
  label: string;
  icon?: DropdownIconName;
  intent?: DropdownIntent;
  href?: string;
}

export interface DropdownSearchConfig {
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

export interface DropdownDividerItem {
  type: 'divider';
  id: string;
  spacing?: 'normal' | 'compact';
}

export interface DropdownActionItemBase {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  intent?: DropdownIntent;
  meta?: string;
}

export interface DropdownLinkItem extends DropdownActionItemBase {
  type: 'link';
  href: string;
  external?: boolean;
}

export interface DropdownActionItem extends DropdownActionItemBase {
  type: 'action';
  value?: string;
}

export interface DropdownCheckboxItem extends DropdownActionItemBase {
  type: 'checkbox';
  value: string;
  checked?: boolean;
}

export interface DropdownUserItem extends DropdownActionItemBase {
  type: 'user';
  avatar: DropdownAvatar;
  value: string;
}

export interface DropdownSubmenuItem extends DropdownActionItemBase {
  type: 'submenu';
  children: DropdownItem[];
}

export type DropdownLeafItem =
  | DropdownLinkItem
  | DropdownActionItem
  | DropdownCheckboxItem
  | DropdownUserItem;

export type DropdownItem =
  | DropdownLeafItem
  | DropdownDividerItem
  | DropdownSubmenuItem;

export interface DropdownSection {
  id: string;
  title?: string;
  description?: string;
  items: DropdownItem[];
  separatorAfter?: boolean;
}

export interface DropdownSelectEvent {
  item: DropdownLeafItem | DropdownSubmenuItem;
  path: string[];
}

export interface DropdownCheckboxChangeEvent {
  item: DropdownCheckboxItem;
  path: string[];
  checked: boolean;
}
