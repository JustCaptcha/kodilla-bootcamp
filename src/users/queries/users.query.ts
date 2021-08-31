import { TextFilterType } from '../../shared/enums/text-filter-type.enum';

export interface UsersQuery {
  dateMin?: string;
  dateMax?: string;
  firstName?: string;
  lastName?: string;
  nameFilterType?: TextFilterType;
  sortField?: string;
  orderDirection?: 'DESC' | 'ASC';
}
