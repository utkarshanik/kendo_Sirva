import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_GRID, DataBindingDirective, GridComponent, EditEvent, AddEvent, CancelEvent, SaveEvent, RemoveEvent, GridModule, CellClickEvent } from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_CHECKBOX, KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_GRID_PDF_EXPORT, KENDO_GRID_EXCEL_EXPORT } from '@progress/kendo-angular-grid';
import { process,State, SortDescriptor, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { fileExcelIcon, SVGIcon, plusIcon,menuIcon} from '@progress/kendo-svg-icons';
import { KENDO_BUTTONS, KENDO_DROPDOWNBUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST, KENDO_DROPDOWNTREE, KENDO_MULTICOLUMNCOMBOBOX} from '@progress/kendo-angular-dropdowns';
import { IconsModule } from '@progress/kendo-angular-icons';
import { Product,Category } from '../products';
import { DataservieService } from '../services/dataservie.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule,Validators,} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { listItems,categories} from './dropdown_data';
import { GridSettings } from './gridPref/grid-settings.interface';
import { SavedPreference, StatePersistingService } from './gridPref/service/state-persisting.service';
import { KENDO_DATEPICKER } from '@progress/kendo-angular-dateinputs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'node:console';
import { identity } from 'rxjs';

@Component({
  selector: 'app-datamanage',
  imports: [KENDO_GRID, GridModule, CommonModule, HttpClientModule,
    KENDO_CHARTS,
    KENDO_INPUTS,NgbDropdownModule,KENDO_MULTICOLUMNCOMBOBOX,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,KENDO_BUTTONS,KENDO_DROPDOWNLIST,
    IconsModule,KENDO_DATEPICKER,NgbDropdownModule,
    KENDO_DROPDOWNTREE,KENDO_CHECKBOX,ReactiveFormsModule,FormsModule],
    providers: [DataservieService],
  templateUrl: './datamanage.component.html',
  styleUrls: ['./datamanage.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
})

export class DatamanageComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  @ViewChild('myGrid') grid!: GridComponent;

 public listItems = listItems;
 public gridData: Product[] = [];
 public mySelection: string[] = [];
 public excelSVG: SVGIcon = fileExcelIcon;
 public gridData2: Product[] = [];
 public categories: Category[] = categories;
 public formGroup: FormGroup | undefined;
 private editedRowIndex: number | undefined = undefined;
 private currentlyEditedRow: number | undefined;
 private originalGridData: Product[] = [];
 public menuIcon = menuIcon;
 public plusIcon= plusIcon;

 public savedPreferences: SavedPreference[] = [];
 public selectedPreferenceId: string = '';
 public selectedPreference: SavedPreference | null = null; 

constructor(private service: DataservieService,public persistingService: StatePersistingService) {
  const persistedSettings = this.persistingService.get("gridSettings") as GridSettings;
  if (persistedSettings && 'state' in persistedSettings && 'columnsConfig' in persistedSettings) {
    this.gridSettings = this.mapGridSettings(persistedSettings);
  }
}

public ngOnInit(): void {
  this.loadProducts();
  this.loadPreferences();
}
//fetching data from the service
private loadProducts(): void {
  this.service.products().subscribe((data) => {
    this.gridData = process(data, { filter: this.filter }).data;
    this.originalGridData = [...data]; 
  });
}
// Load saved preferences from the service
private loadPreferences(): void {
  //Getting all the saved preferences from the service
  this.savedPreferences = this.persistingService.getAllPreferences();
  this.savedStateExists = this.savedPreferences.length > 0;
}
//Adding new row to the grid
  public addHandler(args: AddEvent | { sender: any }): void {
    const sender = args.sender || this.grid;
    this.closeEditor(sender);

    this.formGroup = createFormGroup({
      ProductName: '',
      UnitPrice: "0",
      UnitsInStock: 0,
      CategoryID: 0,
      SupplierID: 0,
      QuantityPerUnit: "0",
      UnitsOnOrder: 0,
      ReorderLevel: "0",
      ProductID: 0,
      Discontinued: false,
      Sales: "0",
      Source: "0",
      Coordinator: "0",
      Mobile: "0",
      AssignedDate: "0",
      EffectiveDate: "0",
      ValidDate: "0",
      CheckingDate: "0",
    });

    sender.addRow(this.formGroup);
  }
// Save handler for both add and edit operations
  public saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
    const formValue = formGroup.value;
    console.log('Form Value:', sender,typeof sender);
    // Format date before saving
    if (formValue.AssignedDate instanceof Date) {
      formValue.AssignedDate = formValue.AssignedDate.toISOString();
    }
    formValue.EffectiveDate = formValue.EffectiveDate.toISOString();
    formValue.ValidDate = formValue.ValidDate.toISOString();
    const product = {
      ...formValue,
      id: dataItem.id
    };
  
    if (isNew) {
      this.service.addProduct(product).subscribe(() => this.loadProducts());
      this.closeEditor(sender, rowIndex);
    } else {
      this.service.updateProduct(product).subscribe(
        () => {
          this.loadProducts();
          // sender.closeRow(rowIndex); // Close the row after saving
          this.closeEditor(sender, rowIndex);
        },
        error => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  // Edit handler for opening the editor
  // public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
  //   this.closeEditor(sender);
  //   this.formGroup = createFormGroup(dataItem);
  //   this.editedRowIndex = rowIndex;
  //   this.currentlyEditedRow = rowIndex;
  //   sender.editRow(rowIndex, this.formGroup);
  // }

// Remove handler for deleting a row
  public removeHandler({ dataItem }: RemoveEvent): void {
    this.service.removeProduct(dataItem).subscribe(() => this.loadProducts());
  }
// Cancel handler for closing the editor without saving
  private closeEditor(sender:any, rowIndex = this.editedRowIndex): void {
    if (rowIndex !== undefined) {
      sender.closeRow(rowIndex);
    }
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.currentlyEditedRow = undefined;
  }
// Cancel handler for closing the editor
  // public cancelHandler({ sender, rowIndex }: CancelEvent): void {
  //   this.closeEditor(sender, rowIndex);
  // }

// ----------Edit On Row Click------------------->
@HostListener('document:click', ['$event'])
handleDocumentClick(event: MouseEvent) {
  if (!this.grid?.wrapper.nativeElement.contains(event.target)) {
    this.saveCurrentEdit();
  }
}
// Handle cell click event to open the editor
public cellClickHandler({isEdited,dataItem,rowIndex,sender}: CellClickEvent): void {
  if (isEdited || (this.formGroup && !this.formGroup.valid)) {
    return;
  }
  // if (this.isNew) {
  //   rowIndex += 1;
  // }
  this.saveCurrentEdit();  // To save when click on another row cell
  this.formGroup = createFormGroup(dataItem);
  this.editedRowIndex = rowIndex;
  sender.editRow(rowIndex, this.formGroup);
}
// Save the current edit when clicked inside / outside[With Event] grid
private saveCurrentEdit(): void {
  if (this.formGroup?.dirty && this.editedRowIndex !== undefined) {
    const data = this.grid.data as Product[] | null;
    const dataItem = data?.[this.editedRowIndex];
    
    if (dataItem) {
      this.saveHandler({
        sender: this.grid,
        rowIndex: this.editedRowIndex,
        formGroup: this.formGroup,
        isNew: false,
        dataItem
      });
    }
  }
}
  //---------------------Save Prefrence-------------------->
  //gridSetting obj holds the grid behaviour and data via state, gridData and columnsConfig 
  // we just need state,gridData and columnsConfig , skip,take, filter, group are for default state of the grid
  public gridSettings: GridSettings = {
    state: {
      skip: 0,
      take: 5,
      filter: {                        //can skip this part 
        logic: "and",
        filters: [],
      },
      group: [],
    },
    gridData: process(this.gridData, {
      skip: 0,                         // default skip value
      take: 5,
      filter: {
        logic: "and",
        filters: [],
      },
      group: [],
    }),
    columnsConfig:[],
  };
// Save the current state of the grid when it changes...
public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    // Update the grid data based on the new state
    this.gridSettings.gridData = process(this.gridData, state);
  }
  private isValidGridSettings(settings: any): settings is GridSettings {
    return settings 
      && 'state' in settings 
      && 'columnsConfig' in settings 
      && Array.isArray(settings.columnsConfig);
  }
// Save the grid Prefrence to the service
public saveGridSettings(grid: GridComponent): void {
    console.log('Saving grid settings...',grid.columns.toArray());
    const name = prompt('Enter a name for this preference:');
    if (!name) return;
    const gridConfig = {
      state: this.gridSettings.state,
      gridData: this.gridSettings.gridData,
      // looping over each column to extract and save specific column-related settings[col_config]:
      columnsConfig: grid.columns.toArray().map(item => ({
        field: (item as any).field,
        width: (item as any).width,
        title: (item as any).title,
        filter: (item as any).filter,
        format: (item as any).format,
        filterable: (item as any).filterable,
        orderIndex: item.orderIndex,
        hidden: item.hidden,
      })) 
    };
  
    this.persistingService.savePreference(name, gridConfig);
    this.loadPreferences();
  }
  
// Load saved state from the selected preference
public loadSavedState(preference: SavedPreference): void {
  // preference is Users Selected Preference a obj that holds name,id,gridConfig
    if (!preference || !this.isValidGridSettings(preference.gridConfig)) {
      console.warn('Invalid or missing preference:', preference);
      return;
    }
    try {
      // Using the mapGridSettings () to map the saved state to the grid   
      this.gridSettings = this.mapGridSettings(preference.gridConfig);
      if (!this.grid) return;
      const { state, columnsConfig } = this.gridSettings;
      // Apply the saved state to the grid
      this.grid.sort = state.sort || [];
      this.grid.filter = state.filter || null;
      this.gridSettings.state.take = this.gridData.length;// Show all rows
      this.gridSettings.state.skip = 0;                    // Reset to first page
      this.grid.pageSize = this.gridData.length;
      this.grid.skip = 0;  
      // Apply saved  column configurations
      if (columnsConfig?.length) {
        const columns = this.grid.columns.toArray();
        columns.forEach(column => {
          // Match the current column with its saved configuration by field name
          const saved = columnsConfig.find(c => c.field === (column as any).field);
          if (saved) {
            column.width = saved.width;
            column.hidden = saved.hidden;
            (column as any).orderIndex = saved.orderIndex;
          }
        });
        // Optional: Reordering (uncomment if needed)
        // columns.sort((a, b) => ((a as any).orderIndex || 0) - ((b as any).orderIndex || 0));
      }
      // Reapply the grid data with the new state
      this.gridData = process(this.gridData, state).data; //`.data` gives the processed visible rows
      this.grid.data = [...this.gridData];
    } catch (error) {
      console.error('Error applying grid settings:', error);
    }
  }
    public savedStateExists: boolean = false;

  // prepares grid blueprint from saved config returns a normalized configuration 
  public mapGridSettings(gridSettings: GridSettings): GridSettings {
    const state = gridSettings.state;
    // this.mapDateFilter(state.filter);
    return {
      state,
      columnsConfig: gridSettings.columnsConfig.sort(
        (a: any, b: any) => a.orderIndex - b.orderIndex
      ),
      gridData: process(this.gridData, state),
    };
  }

  // private mapDateFilter = (descriptor: any) => {
  //   const filters = descriptor.filters || [];

  //   filters.forEach((filter: any) => {
  //     if (filter.filters) {
  //       this.mapDateFilter(filter);
  //     } else if (filter.field === "FirstOrderedOn" && filter.value) {
  //       filter.value = new Date(filter.value);
  //     }
  //   });
  // };

//--------Delete Saved Prefrences------------------->
  deletePreference(item: any, event: Event): void {
    // item is SavedPreference holds id,naem,gridConfig
    event.stopPropagation(); // Prevent dropdown from selecting the item
    const index = this.savedPreferences.indexOf(item);
    if (index > -1) {
      this.savedPreferences.splice(index, 1);
      // Optional: clear selectedPreference if it's the deleted one
      if (this.selectedPreference?.id === item.id) {
        this.selectedPreference = null;
      }
    }
    this.persistingService.deletePreference(item.id);
  }
//-------Adding Custom Filter ------------------>
  filterMobile: boolean = false;
  filterWeb: boolean = false;
  
  applyCustomFilter(): void {
    const filterConditions = [];

    if (this.filterMobile) {
      filterConditions.push({ field: 'Source', operator: 'eq', value: 'Mobile' });
    }

    if (this.filterWeb) {
      filterConditions.push({ field: 'Source', operator: 'eq', value: 'Web' });
    }

    const newFilter: CompositeFilterDescriptor = {
      logic: 'or', 
      filters: filterConditions
    };

    console.log('Applying custom filter:', newFilter);

    // Apply the filter
    this.filterChange(newFilter);
  } 
public allOptions: string[] = ['Mobile', 'Web'];
public filteredOptions: string[] = [...this.allOptions];
public selectedOptions: string[] = [];

public filter: CompositeFilterDescriptor = {
  logic: 'or',
  filters: [],
};

public filterChange(filter: CompositeFilterDescriptor): void {
  this.filter = filter;
  console.log('Filter changed:', filter);
  this.loadProducts();
}

// Called when typing in the search box
onSearchChange(searchText: string): void {
  this.filteredOptions = this.allOptions.filter(option => 
    option.toLowerCase().includes(searchText.toLowerCase())
  );
}
// Called when checking/unchecking checkboxes
onCheckboxChange(event: any, column: any, filterService: any): void {
  const value = event.target.value;
  const isChecked = event.target.checked;

  if (isChecked) {
    this.selectedOptions.push(value);
  } else {
    this.selectedOptions = this.selectedOptions.filter(v => v !== value);
  }

  // Now apply the filters
  const filters = this.selectedOptions.map(opt => ({
    field: column.field,
    operator: 'eq',
    value: opt
  }));

  filterService.filter({
    logic: 'or',
    filters: filters
  });
}

//------- Filter function for the Search bar--------------->
public onFilter(value: string): void {
  if (!value) {
    // Reset to original data if search is empty
    this.gridData = [...this.originalGridData];
    return;
  }
  const inputValue = value.toLowerCase();
  this.gridData = this.originalGridData.filter(item => {
    return Object.keys(item).some(prop => {
      const value = item[prop]?.toString().toLowerCase();
      return value?.includes(inputValue);
    });
  });
  // Only set skip if dataBinding exists
  if (this.dataBinding) {
    this.dataBinding.skip = 0;
  }
}
// -----------Excel-Sort-Toogle----------------->
  // Sort function for the dropdown
  public dropdownSort: SortDescriptor[] = [];
  public onSortChange(sort: SortDescriptor[]): void {
  this.dropdownSort = sort;  //Save the sort descriptor, Reapply it later when resetting the grid state.
  //re-processing the grid data with the new sort settings
  this.gridData = process(this.gridData, { sort }).data; //Applies sorting as defined in sort on grid data, Sets the result (.data) back into this.gridData
  }
// coloumnMenu Setting for the grid
  // public columnMenuSettings: ColumnMenuSettings = {
  //   filter: true,
  //   columnChooser: true
  // };

//Excel Export function
exportExcel(): void {
    if (this.grid) {
      this.grid.saveAsExcel();
    } else {
      console.warn("Grid reference is undefined.");
    }
  }
//Clear filter 
  onButtonClick() {
    window.location.reload();
  }
//Toggle between two buttons
  selected: string = 'non-intl';
  selectButton(type: string) {
    this.selected = type;
  }
// Add id-value for Drop down => lead stage
public category(id: number): Category {
  const category = this.categories.find((x) => x.CategoryID === id);
  if (!category) {
    throw new Error(`Category with ID ${id} not found`);
  }
  return category;
}
public getCategoryName(categoryId: number): string {
  const category = this.categories.find(c => c.CategoryID === categoryId);
  return category?.CategoryName || '';
}

}

//Reactive form group for the grid
const createFormGroup = (dataItem: Partial<Product>) =>
  new FormGroup({
    id: new FormControl(dataItem.id),
    ProductID: new FormControl(dataItem.ProductID, Validators.required),
    ProductName: new FormControl(dataItem.ProductName, Validators.required),
    UnitPrice: new FormControl(dataItem.UnitPrice),
    UnitsInStock: new FormControl(
      dataItem.UnitsInStock,
      Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])
    ),
    CategoryID: new FormControl(dataItem.CategoryID, Validators.required),
    SupplierID: new FormControl(dataItem.SupplierID),
    QuantityPerUnit: new FormControl(dataItem.QuantityPerUnit),
    UnitsOnOrder: new FormControl(dataItem.UnitsOnOrder),
    ReorderLevel: new FormControl(dataItem.ReorderLevel),    
    Discontinued: new FormControl(dataItem.Discontinued),
    Sales: new FormControl(dataItem.Sales),
    Source: new FormControl(dataItem.Source),
    Coordinator: new FormControl(dataItem.Coordinator),
    Mobile: new FormControl(dataItem.Mobile),
    AssignedDate: new FormControl(
      dataItem.AssignedDate ? new Date(dataItem.AssignedDate) : null
    ),
    EffectiveDate: new FormControl(dataItem.EffectiveDate ? new Date(dataItem.EffectiveDate) : null),
    ValidDate: new FormControl(dataItem.ValidDate ? new Date(dataItem.ValidDate) : null),
    CheckingDate: new FormControl(dataItem.CheckingDate),

  });

// {
// Close the editor when cell is edited
// public onCellClose(args: any): void {
//   if (this.formGroup?.dirty && this.editedRowIndex !== undefined) {
//     const data = this.grid.data as Product[] | null;
//     const dataItem = data && this.editedRowIndex !== undefined ? data[this.editedRowIndex] : null;
//     this.saveHandler({
//       sender: this.grid,
//       rowIndex: this.editedRowIndex,
//       formGroup: this.formGroup,
//       isNew: false,
//       dataItem
//     });
//   }
// }

//custom Filter 
  // public filter: CompositeFilterDescriptor = {
  //   logic: "or",
  //   filters: [],
  // };
// onCheckboxChange(column: any, filterService: any) {
  //   const filters = [];
  
  //   if (this.filterMobile) {
  //     filters.push({
  //       field: column.field,
  //       operator: 'eq',
  //       value: 'Mobile'
  //     });
  //   }
  
  //   if (this.filterWeb) {
  //     filters.push({
  //       field: column.field,
  //       operator: 'eq',
  //       value: 'Web'
  //     });
  //   }
  
  //   // Apply combined filter
  //   filterService.filter({
  //     logic: 'or', // or 'and' depending on your need
  //     filters: filters
  //   });
  // }
// }
