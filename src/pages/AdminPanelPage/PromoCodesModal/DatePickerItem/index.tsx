import DatePicker from 'react-datepicker';
import CalendarIcon from '@/assets/calendar.svg?react';

import { format } from 'date-fns';

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface IPops {
  expiresAt?: Date;
  onChange: (val: Date) => void;
  disabled: boolean;
}

export const DatePickerItem = ({ expiresAt, onChange, disabled }: IPops) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const handleChange = (val: Date | null) => {
    if (val) onChange(val);
    handleOpenClick();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenClick}>
      <PopoverTrigger disabled={disabled}>
        <div
          className={cn(`flex gap-1 cursor-pointer`, {
            'cursor-not-allowed opacity-50': disabled,
          })}
          onClick={handleOpenClick}
        >
          <div>
            <CalendarIcon />
          </div>
          {expiresAt ? <div>{format(expiresAt, 'dd/MM/yy')}</div> : 'Pick a date'}
        </div>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="p-0 w-full">
        <DatePicker
          inline
          selected={expiresAt}
          onChange={handleChange}
          minDate={new Date()}
          calendarClassName="!border-0 dp-no-border"
        />
      </PopoverContent>
    </Popover>
  );
};
