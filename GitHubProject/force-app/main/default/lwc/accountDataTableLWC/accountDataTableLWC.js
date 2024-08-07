import { LightningElement , track, wire} from 'lwc';
import getAccount from '@salesforce/apex/AccountController.getAccountList';
import { updateRecord } from 'lightning/uiRecordApi';
//import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
//import ACCOUNT_OBJECT from '@salesforce/schema/Account';
//import  PICKLIST_FIELD from '@salesforce/schema/Account.Rating';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountDataTable extends LightningElement {

//onrowaction

@track accounts;
@track accList;
@track error;
@track filteredData =[];
searchData = '';
delayTimeOut;
@track maxRowSelection;
selectedRecordId = [];
selectedRowCount;
@track isSpinner = false;
saveDraftValues = [];
draftValues = [];
@track pageSize=10;
totalPages; 
pageNumber = 1; 
recordsToDisplay = [];
@track pickListOptions;

get options() {
        return [
            { label: '10', value: '10' },
            { label: '25', value: '25' },
            { label: '50', value: '50' },
            { label: '100', value: '100'}
        ];
    }



@track accountColumn = [{
                label: 'Account name',
                fieldName: 'Name',
                type: 'text',
                sortable: true,
        },{
                label: 'Type',
                fieldName: 'Type',              
                type: 'text',
                sortable: true,
        },{
                label: 'Annual Revenue',
                fieldName: 'AnnualRevenue',
                type: 'Currency',
                sortable: true,
                editable: true
        },{
                label: 'Phone',
                fieldName: 'Phone',
                type: 'phone',
                sortable: true,
                editable: true
        }
        /*{
                label: 'Rating', fieldName: 'Rating', type: 'picklistColumn', sortable: true, editable: true,
                typeAttribute: {
                        placeholder: 'Choose Rating', options: { fieldName: 'pickListOptions' }, 
                        value: { fieldName: 'Rating' }, 
                        context: { fieldName: 'Id' } 
                }
        }*/
];
/*
@wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
objectInfo;

@wire(getPicklistValues, {recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: PICKLIST_FIELD })
wirePickList({ error, data }) {
        if (data) {
            this.pickListOptions = data.values;
        } else if (error) {
            console.log(error);
        }
    }   

*/
connectedCallback() {
        this.isSpinner = true;
}

@wire(getAccount)
wiredAccounts({error,data}) {
        this.isSpinner = false;
        if (data) {
        this.accList = data;
        this.totalRecords = this.accList.length;
        /*
        this.accounts = JSON.parse(JSON.stringify(result.data));
        this.accounts.forEach(ele=>{
                ele.pickListOptions=this.pickListOptions;
        })
        */
        this.filterData(); 
        this.paginationHelper();
        
} else if (error) {
        this.error = error;
}
}

searchChange(event){
        this.searchData = event.target.value;
        console.log(this.searchData.length)
        
        this.searchData.length === 0 ? this.timeOutClear() : this.debounceFilter() ;
}

debounceFilter(){
        clearTimeout(this.delayTimeOut);       
        this.delayTimeOut = setTimeout(() => { 
                this.filterData();
        },300)   
        this.isSpinner = true;

}

filterData(){
        this.filteredData = this.accList.filter(record =>
                Object.values(record).some(value =>
                String(value).toLowerCase().includes(this.searchData.toLowerCase())
                )
        );
        this.isSpinner = false;
}


handleRowAction(event){
                const selectedRows = event.target.selectedRows;
                var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows(); 
                this.selectedRowCount = selectedRows.length;

                for(let i=0; i<selectedRows.length; i++){
                this.selectedRecordId.push(selectedRecords[i].Id);      
        }
}

contactClick(event){
        const contactRecord = event.target.value;
        if(this.selectedRowCount == 0 || this.selectedRowCount == null){
                alert('Please select one record');
        }
        if(this.selectedRowCount > 1){
                this.ShowToast('Toast Info', 'Please select one record!!', 'info', 'dismissable');
                event.preventDefault();
                return;
        }
}

handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
    
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.saveDraftValues = [];
            this.refresh();
        }).catch(error => {
            console.log("Error:", error);
            this.ShowToast('Error', 'An Error Occurred!!', 'error', 'dismissable');
        }).finally(() => {
                this.saveDraftValues = [];
            });
    }
    
/*
    async handleSave2(event) {
    console.log( 
      'event.detail.draftValues' + JSON.stringify(event.detail.draftValues)
    )
 
    const records = event.detail.draftValues.slice().map(draftValue => {
      const fields = Object.assign({}, draftValue)
      return { fields }
    })
 
    console.log(JSON.stringify(records));
 
    this.draftValues = []
 
    try {
      const recordUpdatePromises = records.map(record => updateRecord(record))
      console.log(JSON.stringify(recordUpdatePromises))
      await Promise.all(recordUpdatePromises)
      this.dispatchEvent(       
        new ShowToastEvent({
          title: 'Success',
          message: 'Records updated',
          variant: 'success'
        })
      )
 
      //await refreshApex(this.filteredData)
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Error updating or reloading records',
          message: error.body.message,
          variant: 'error'
        })
      )
    }
  } 
*/





handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
}
    
get disableFirst(){
        return this.pageNumber == 1;
}
   
get disableLast(){
        return this.pageNumber == this.totalPages;
}



    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

 timeOutClear(){
        clearTimeout(this.delayTimeOut); 
        this.isSpinner = false;
        this.paginationHelper();
 }   
paginationHelper(){

        this.filteredData = [];
        let recordsDisplay = [];

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log(this.totalPages)
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            recordsDisplay.push(this.accList[i]);
        }
        this.filteredData = [...recordsDisplay];
}

ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
    }


    async refresh() {
        await refreshApex(this.filteredData);
    }



}