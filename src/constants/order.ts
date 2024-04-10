// LOW_PRIO: add types
export const STATUS_MAPPER: any = {
  PAYMENT: {
    statusColor: 'text-orange-600',
    statusText: 'Очікування на оплату',
  },
  HANDLING: {
    statusColor: 'text-amber-500',
    statusText: 'Очікування на відправку',
  },
  SHIPPING: {
    statusColor: 'text-cyan-600',
    statusText: 'Товар в дорозі',
  },
  FINISHED: {
    statusColor: 'text-main',
    statusText: 'Завершено',
  },
  CANCELED: {
    statusColor: 'text-red-500',
    statusText: 'Скасовано',
  },
};
