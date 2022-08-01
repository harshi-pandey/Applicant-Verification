import { LightningElement, api } from 'lwc';

export default class TableViewerDynamic_sls extends LightningElement {
    
    @api masterData ={};
    @api hideheader = false;
    @api hideCheckboxCol = false;
    @api theme;
    headerStyle = 'headergrey';
    subHeader = '';
    showTable = true;
    notabledata = false;
    tableList = [];
    tableHeader = [];
    hideShowIcon = 'utility:chevrondown';
    showSpinner = false;
    dataList;
    approvalAuthority;
    notifyAuthority;
    options;

    connectedCallback() {
        if (this.masterData) {
            this.getdata(this.masterData);
        }

        //Set Theme
        if(this.theme == 'green'){
            this.headerStyle = 'headerGreen';
            this.subHeader = 'SubHeaderGreen';
        }
        else if(this.theme == 'pink'){
            this.headerStyle = 'headerPink';
            this.subHeader = 'SubHeaderPink';
        }
        else if(this.theme == 'blue'){
            this.headerStyle = 'headerBlue';
            this.subHeader = 'SubHeaderBlue';
        }

    }
    
    getdata(data) {
        console.log(JSON.stringify(data))
        this.notabledata = false;
        let hastabledata = data.hasOwnProperty('tableData');
        if (hastabledata) {
            this.tableList = data.tableData;
            this.tableHeader = data.tableHeader;
            this.sectionName = data.sectionName;
            this.approvalAuthority = data.approvalAuthority;
            this.notifyAuthority = data.notifyAuthority;
            this.options = data.actions;
            this.notabledata = false;     
        } 
        else {
            this.notabledata = true;
        }
    }

    hideandshow() {
        if (this.showTable == true) {
            this.showTable = false;
            this.hideShowIcon = 'utility:chevronright';
        }
        else {
            this.showTable = true;
            this.hideShowIcon = 'utility:chevrondown';
        }
    }

    //select all function for checkbox
    selectallcheckboxcheckAll(event) {
        const checkboxList = this.template.querySelectorAll('[data-id^="selectfields"]');
        if (event.target.checked) {
            for (const checkboxelement of checkboxList) {
                checkboxelement.checked = event.target.checked;
            }
        }
        else {
            for (const checkboxelement of checkboxList) {
                checkboxelement.checked = false;
            }
        }
    }

    handleQuery(event){
        let field = event.currentTarget.dataset.field;
        let value = event.currentTarget.dataset.value;
        let searchExpr='div[data-field="'+field+'"][data-value="' + value +'"]';
        let elements=this.template.querySelectorAll('div.raise-auth');
        elements.forEach(element=>{
            element.classList.add('slds-hide');
        });
        let element = this.template.querySelector(searchExpr);
        element?.classList.remove('slds-hide');
    }

    queryClosed(){
        let elements = this.template.querySelectorAll('div.raise-auth');
        elements.forEach(element=>{
            element.classList.add('slds-hide');
        });
    }
}