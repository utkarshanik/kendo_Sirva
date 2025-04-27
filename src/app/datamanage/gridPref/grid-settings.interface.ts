import { State } from "@progress/kendo-data-query";
import { ColumnSettings } from "./column-settings.interface";
import { GridDataResult } from "@progress/kendo-angular-grid";

export interface GridSettings {
  columnsConfig: ColumnSettings[];
  state: State;
  gridData: GridDataResult | any[];
}