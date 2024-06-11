import { LightningElement , track, wire} from 'lwc';
import getAccount from '@salesforce/apex/AccountController.getAccountList';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountDataTable extends LightningElement {

//onrowaction


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
totalRecords;
get options() {
        return [
            { label: '10', value: '10' },
            { label: '25', value: '25' },
            { label: '50', value: '50' }
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
        },{
                label: 'Rating',
                fieldName: 'Rating',
                type: 'text',
                sortable: true,
        }
];


connectedCallback() {
        this.isSpinner = true;
}

@wire(getAccount)
wiredAccounts({error,data}) {
        this.isSpinner = false;
        if (data) {
        this.accList = data;
        console.log(this.accList.length)
        this.totalRecords = this.accList.length;
        this.filterData(); 
        console.log('d')     
        console.log(this.accList);   
} else if (error) {
        this.error = error;
        console.log(JSON.stringify(this.error));
}
}

searchChange(event){
        this.searchData = event.target.value;
        this.isSpinner = true;
        this.debounceFilter();
}

debounceFilter(){
        clearTimeout(this.delayTimeOut);       
        this.delayTimeOut = setTimeout(() => { 
                this.filterData();
        },300)  
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
                console.log( this.selectedRowCount)
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
        }).catch(error => {
            console.log("Error:", error);
            this.ShowToast('Error', 'An Error Occurred!!', 'error', 'dismissable');
        }).finally(() => {
                this.saveDraftValues = [];
            });
    }
    

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