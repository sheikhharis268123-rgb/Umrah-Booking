
import React, { useRef, useEffect } from 'react';

interface DateScrollerProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

const DateScroller: React.FC<DateScrollerProps> = ({ selectedDate, onDateSelect }) => {
    const scrollerRef = useRef<HTMLDivElement>(null);

    const dates = Array.from({ length: 60 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    useEffect(() => {
        const selectedEl = scrollerRef.current?.querySelector('[data-selected="true"]');
        if (selectedEl && scrollerRef.current) {
            const scrollerLeft = scrollerRef.current.getBoundingClientRect().left;
            const selectedLeft = selectedEl.getBoundingClientRect().left;
            const scrollOffset = selectedLeft - scrollerLeft - scrollerRef.current.clientWidth / 2 + selectedEl.clientWidth / 2;
            
            scrollerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    }, [selectedDate]);

    return (
        <div className="relative group">
            <div ref={scrollerRef} className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
                {dates.map(date => {
                    const dateString = date.toISOString().split('T')[0];
                    const isSelected = dateString === selectedDate;

                    return (
                        <button
                            key={dateString}
                            data-selected={isSelected}
                            onClick={() => onDateSelect(dateString)}
                            className={`flex-shrink-0 w-24 text-center p-3 rounded-lg transition-colors duration-200 ${
                                isSelected 
                                ? 'bg-primary text-white shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary'
                            }`}
                        >
                            <p className="font-bold text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-2xl font-bold">{date.getDate()}</p>
                            <p className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</p>
                        </button>
                    );
                })}
            </div>
             <div className="absolute top-1/2 -translate-y-1/2 -left-4 h-full w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute top-1/2 -translate-y-1/2 -right-4 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
};

export default DateScroller;
