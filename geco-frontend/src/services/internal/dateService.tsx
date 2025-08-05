import { format } from 'date-fns';

export const DateService = {
  getDateString: (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'del' y");
  },
};
