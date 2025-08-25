export interface Attribute {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  values?: AttributeValue[];
}

export interface AttributeValue {
  id?: number;
  attribute_id: number;
  value: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  attribute?: Attribute;
}