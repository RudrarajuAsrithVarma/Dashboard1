import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDataGridComponent } from 'devextreme-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  [x: string]: any;
  dataSource: any[] = [];
  gridColumns: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 6;
  startIndex = (this.currentPage - 1) * this.pageSize;
  endIndex = this.startIndex + this.pageSize;
  searchRecordText: any;
  searchFileNameText:any;
  recordId:any;
  filename:any;
  startDate!: any;
  endDate!: any;


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadIntialData();
    this.gridColumns = [
      {
        dataField: 'RECORD_ID',
        cellStyle: { color: 'lightblue' },
      },
      {
        dataField: 'PDF_FILE_NAME',
        allowEditing: true,
      },
      { dataField: 'PAGE_COUNT' },
      { dataField: 'INPUT_DATE' },
      { dataField: 'ANALYST_ALIAS_FILE_NAME' },
      { dataField: 'SCANNED_DATE' },
      { dataField: 'COMPLETED_DATE' },
      {
        dataField: 'pc_main_doc_id',
        cellTemplate: 'customCellTemplate',
      },
    ];
  }

  loadIntialData(){
    const urlinit='assets/pc_api_index_result.json';
    this.http.get<any[]>(urlinit).subscribe((data) => {
      this.dataSource = data;
      console.log(this.dataSource);
    });

  }

  loadData() {
    const apiUrl = '/get_data/';
    const params = {
      RECORD_ID:this.recordId,
      PDF_FILE_NAME:this.filename,
      START_DATE:this.startDate,
      END_DATE:this.endDate
    };
  
    params.RECORD_ID = this.searchRecordText || null;
    params.PDF_FILE_NAME = this.searchFileNameText || null;
    params.START_DATE = this.startDate || null; 
    params.END_DATE = this.endDate || null;
    
    const body = JSON.stringify(params);

    this.http.post<any[]>(apiUrl, body ).subscribe((data) => {
      this.dataSource = data;
      console.log(this.dataSource);
    });
  }
  

  onPageChange(event: number) {
    this.currentPage = event;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    // Reload data with the entered search text as a parameter
    this.loadData();
  }

  getURLForPCMainDocID(pcMainDocID: string): string {
    // Assuming the URL looks like: 'base_url/pc_main_doc_id'
    return 'https://www.campsystems.com/';
  }

  search() {
    if (
      !this.searchRecordText &&
      !this.searchFileNameText &&
      !this.startDate &&
      !this.endDate
    ) {
      // Display an alert when all inputs are null
      alert('Please choose at least one input to search.');
      return;
    }

    // Reload data with the entered search text as a parameter
    this.loadData();
  }
}
