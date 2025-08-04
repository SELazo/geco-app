export interface IGroupsGrowthLastXMonthsResponse {
  groupsInfo: {
    label: string;
    quantityPerMonth: number[];
  }[];
  generalInfo: {
    label: string;
    quantityPerMonth: number[];
  };
  strategiesInfo: {
    label: string;
    quantityPerMonth: number[];
  };
}

export interface IContactsCompositionResponse {
  groups: {
    label: string;
    quantity: number;
  }[];
  total: number;
}
