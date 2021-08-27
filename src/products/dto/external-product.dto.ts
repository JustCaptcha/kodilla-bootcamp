import { Tags } from '../enums/tags.enum';

export interface ExternalProductDTO {
  id: string;
  name: string;
  price: number;
  count: number;
  tags: Array<string>;
  createdAt: Array<number>;
  updatedAt: Array<number>;
}
