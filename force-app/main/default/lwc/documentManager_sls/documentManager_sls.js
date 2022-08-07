import { LightningElement, api } from 'lwc';
import getContentVersion from '@salesforce/apex/ApplicantController_sls.getContentVersion';

export default class DosumentManager_sls extends LightningElement {

    @api recordId;
    filesList = [];
    showSpinner;
    connectedCallback(){
        this.showSpinner = true;
        getContentVersion({ recordId: this.recordId })
        .then(result => {
            console.log('getContentVersionresult' + JSON.stringify(result));
            this.filesList.push(result[0]);
            console.log('File List : ', this.filesList)
            this.showSpinner = false;
        }).catch(err => {
            console.log('err' + JSON.stringify(err));
        })
    }
}