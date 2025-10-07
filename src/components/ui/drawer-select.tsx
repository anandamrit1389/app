import * as React from 'react';
import { Drawer as DrawerSelectPrimitive } from 'vaul';
import Grabber from '@/assets/grabber.svg?react';
import ChevronRight from '@/assets/chevron-right.svg?react';
import ChevronDown from '@/assets/chevron-down.svg?react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const DrawerSelect = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerSelectPrimitive.Root>) => (
  <DrawerSelectPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
DrawerSelect.displayName = 'DrawerSelect';

const DrawerSelectTrigger = DrawerSelectPrimitive.Trigger;

const DrawerSelectPortal = DrawerSelectPrimitive.Portal;

const DrawerSelectClose = DrawerSelectPrimitive.Close;

const DrawerSelectOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerSelectPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerSelectPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerSelectPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));
DrawerSelectOverlay.displayName = DrawerSelectPrimitive.Overlay.displayName;

const DrawerSelectContent = React.forwardRef<
  React.ElementRef<typeof DrawerSelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerSelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerSelectPortal>
    <DrawerSelectOverlay />
    <DrawerSelectPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mb-2 flex justify-center">
        <Grabber />
      </div>
      {children}
    </DrawerSelectPrimitive.Content>
  </DrawerSelectPortal>
));
DrawerSelectContent.displayName = 'DrawerSelectContent';

const DrawerSelectHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
);
DrawerSelectHeader.displayName = 'DrawerSelectContentHeader';

const DrawerSelectFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerSelectFooter.displayName = 'DrawerFooter';

const DrawerSelectTitle = React.forwardRef<
  React.ElementRef<typeof DrawerSelectPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerSelectPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerSelectPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DrawerSelectTitle.displayName = DrawerSelectPrimitive.Title.displayName;

const DrawerSelectDescription = React.forwardRef<
  React.ElementRef<typeof DrawerSelectPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerSelectPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerSelectPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerSelectDescription.displayName = DrawerSelectPrimitive.Description.displayName;

const DrawerSelectItem = ({
  children,
  onClick,
  className,
  isSelected = false,
  isChevron = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onClick?: () => void;
  isSelected?: boolean;
  isChevron?: boolean;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'relative flex justify-between w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-lightGrey hover:bg-lightGrey focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer',
      className,
    )}
    {...props}
  >
    {children}
    {isChevron ? (
      <ChevronRight />
    ) : (
      <>{isSelected && <Check className="size-4 text-slushPink" />}</>
    )}
  </div>
);
DrawerSelectItem.displayName = 'DrawerSelectItem';

const DrawerSelectValue = ({
  children,
  placeholder = 'Select an option...',
  className,
  ...props
}: {
  placeholder?: string;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:border-[#D1D5DB] data-[state=open]:border-[#374151]',
      className,
    )}
    {...props}
  >
    {children || placeholder}
    <ChevronDown />
  </div>
);
DrawerSelectValue.displayName = 'DrawerSelectValue';

export {
  DrawerSelect,
  DrawerSelectPortal,
  DrawerSelectOverlay,
  DrawerSelectTrigger,
  DrawerSelectClose,
  DrawerSelectContent,
  DrawerSelectHeader,
  DrawerSelectFooter,
  DrawerSelectTitle,
  DrawerSelectDescription,
  DrawerSelectItem,
  DrawerSelectValue,
};
