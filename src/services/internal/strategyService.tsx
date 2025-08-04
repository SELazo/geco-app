export interface ISchedule {
  id: number;
  name: string;
  value: string;
}

export interface IPeriodicity {
  id: number;
  name: string;
  value: string;
  active: boolean;
}

export const StrategyService = {
  getPeriodicities: (userStatus: number): IPeriodicity[] => {
    const isPremium = userStatus !== 1;
    return [
      {
        id: 1,
        name: 'Diario',
        value: 'daily',
        active: true,
      },
      {
        id: 2,
        name: 'Semanal',
        value: 'weekly',
        active: isPremium,
      },
      {
        id: 3,
        name: 'Mensual',
        value: 'monthly',
        active: isPremium,
      },
      {
        id: 4,
        name: 'Anual',
        value: 'yearly',
        active: isPremium,
      },
    ];
  },
  getPeriodicity: (periodicity: string): string => {
    const types = ['daily', 'weekly', 'monthly', 'yearly'];
    const periodicities: { [key: string]: string } = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    };
    let response = '';
    if (types.includes(periodicity)) {
      response = periodicities[periodicity];
    }
    return response;
  },
  getSchedules: (): ISchedule[] => {
    return [
      {
        id: 1,
        name: 'Mañana',
        value: '10:00',
      },
      {
        id: 2,
        name: 'Tarde',
        value: '15:00',
      },
      {
        id: 3,
        name: 'Noche',
        value: '20:00',
      },
    ];
  },
};
