// Date and time formatting utilities for modals

export type DateFormat = 
    | 'dd/mm/yy' 
    | 'dd-mm-yy' 
    | 'dd.mm.yy'
    | 'dd full month name years'
    | 'dd month short years'
    | 'full date';

export type TimeFormat = 
    | 'start a.m/p.m - end a.m/p.m'
    | 'start hour:minute a.m/p.m - end hour:minute a.m/p.m'
    | 'morning/evening'
    | '24-hour'
    | 'custom';

export interface EventDateTime {
    startISO: string;
    endISO: string;
    dateFull?: string;
    timeRange?: string;
}

export function formatDate(dateISO: string, format: DateFormat = 'dd full month name years'): string {
    const date = new Date(dateISO);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    const fullYear = date.getFullYear();
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthNamesShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    switch (format) {
        case 'dd/mm/yy':
            return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
        case 'dd-mm-yy':
            return `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`;
        case 'dd.mm.yy':
            return `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
        case 'dd full month name years':
            return `${day} ${monthNames[month]} ${fullYear}`;
        case 'dd month short years':
            return `${day} ${monthNamesShort[month]} ${fullYear}`;
        case 'full date':
            return `${day} ${monthNames[month]} ${fullYear}`;
        default:
            return `${day} ${monthNames[month]} ${fullYear}`;
    }
}

export function formatTime(
    startISO: string, 
    endISO: string, 
    format: TimeFormat = 'start a.m/p.m - end a.m/p.m'
): string {
    const start = new Date(startISO);
    const end = new Date(endISO);
    
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    
    const format12Hour = (hour: number, minute: number) => {
        const period = hour >= 12 ? 'p.m' : 'a.m';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
    };
    
    const format24Hour = (hour: number, minute: number) => {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };
    
    const getTimeOfDay = (hour: number) => {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    };
    
    switch (format) {
        case 'start a.m/p.m - end a.m/p.m':
            return `${format12Hour(startHour, startMinute)} - ${format12Hour(endHour, endMinute)}`;
        case 'start hour:minute a.m/p.m - end hour:minute a.m/p.m':
            return `${format12Hour(startHour, startMinute)} - ${format12Hour(endHour, endMinute)}`;
        case 'morning/evening':
            return `${getTimeOfDay(startHour)} - ${getTimeOfDay(endHour)}`;
        case '24-hour':
            return `${format24Hour(startHour, startMinute)} - ${format24Hour(endHour, endMinute)}`;
        default:
            return `${format12Hour(startHour, startMinute)} - ${format12Hour(endHour, endMinute)}`;
    }
}
