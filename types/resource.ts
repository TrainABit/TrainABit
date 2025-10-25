import { ResourceType } from './enums';

export interface Resource {
  id: string;
  planId: string;
  name: string;
  type: ResourceType;
  description: string;
  contact?: string;
  url?: string;
  availability?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};
