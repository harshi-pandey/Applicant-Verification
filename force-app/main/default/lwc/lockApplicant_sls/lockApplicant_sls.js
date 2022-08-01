import { LightningElement, api } from 'lwc';
import updateApplicant from '@salesforce/apex/lockApplicantController_sls.updateApplicant';

export default class LockApplicant_sls extends LightningElement {

    pickvalue;
    openerror = false;
    sfdcBaseURL;
    @api recordList;
    @api warningMsg;

    connectedCallback(){
        this.recordList = JSON.parse(this.recordList);
    }
    
    handleChange(event){
        this.pickvalue = event.detail.value;        
    }

    closemodel(){
        this.openerror= false;
        history.go(-1);
    }

    savemodel() {
        this.sfdcBaseURL = window.location.origin+'/lightning/n/Action_Queue';
         updateApplicant({ applicantId: this.recordList[0].id, userId:  String(this.pickvalue)})
             .then(data => {
                 if(data){
                     setTimeout(function() {
                        window.open(window.location.origin+'/lightning/n/Action_Queue',"_top");
                      }, 2000);      
                 }else{
                     this.openerror= true;
                     this.warningMsg = 'A Lead is already Locked by the selected User or Some Other User';
                 }
             })
             .catch(error => {
                console.log(error)
                this.openerror= true;
                this.warningMsg = 'Lead is not locked';
             });          
      }
}