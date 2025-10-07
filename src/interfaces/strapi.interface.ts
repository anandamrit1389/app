export interface BlockNode {
  type: string;
  children: BlockNodeChild[];
}

export interface BlockNodeChild {
  type?: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: BlockNodeChild[];
}

export interface LinkBlock extends BlockNode {
  type: 'link';
  url: string;
}

export interface ListBlock extends BlockNode {
  type: 'list' | 'list-ordered';
}
