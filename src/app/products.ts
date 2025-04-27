export interface Product {
  id: number;
  ProductID: number,
  ProductName: string;
  SupplierID: number;
  CategoryID: number;
  QuantityPerUnit: string;
  UnitPrice: string;
  UnitsInStock: number;
  UnitsOnOrder: number;
  ReorderLevel: string;
  Discontinued: boolean;

  Sales:string;
  Coordinator:string;
  Source:string;
  Mobile:string;
  AssignedDate:string;
  EffectiveDate:string;
  ValidDate:string;
  CheckingDate:string;
  [key: string]: string | number | boolean | undefined;
}

export class Category {
  public CategoryID?: number;
  public CategoryName?: string;
 
}

