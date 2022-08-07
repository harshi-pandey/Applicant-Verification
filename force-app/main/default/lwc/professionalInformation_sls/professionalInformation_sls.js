import { LightningElement, api } from 'lwc';
import generateApprovalLetter from '@salesforce/apex/ApplicantController_sls.generateApprovalLetter';
import { NavigationMixin } from 'lightning/navigation';
export default class ProfessionalInformation_sls extends NavigationMixin(LightningElement) {

    @api recordId;
    filesList = [];
    successModal;
    jsonPayLoad = {
        sectionName : 'Personal Details',
        tableHeader:['Field Name', 'Field Value','Team', 'Raise Query', 'Actions', 'Validate'],
        tableData: [
            {value: "Harshi Pandey", field: "Applicant Name", team: "Team A", validated:true},
            {value: "harpandey@deloitte.com", field: "Email ID", team: "Team B", validated:true},
            {value: "9587887872", field: "Mobile Number", team: "Team B", validated:false },
            {value: "Female", field: "Gender", team: "Team C", validated:false}
        ],
        approvalAuthority:[
            {Id : 'AbhinayId', Name : 'Abhinay Pandey'}, 
            {Id : 'JeevanId', Name : 'Jeevan Chandra Pandey'}, 
            {Id : 'PushpaId', Name : 'Pushpa Pandey'}, 
            {Id : 'ArshinId', Name : 'Arshin Mahajan'}, 
            {Id : 'RohitId', Name : 'Rohit Harbola'}, 
            {Id : 'NiharikaId', Name : 'Niharika Srivastava'}, 
        ],
         notifyAuthority:[
            {Id : 'AbhinayId', Name : 'Abhinay Pandey'}, 
            {Id : 'HarshiId', Name : 'Harshi Pandey'}, 
            {Id : 'JeevanId', Name : 'Jeevan Chandra Pandey'}, 
            {Id : 'PushpaId', Name : 'Pushpa Pandey'}, 
            {Id : 'ArshinId', Name : 'Arshin Mahajan'}, 
            {Id : 'RohitId', Name : 'Rohit Harbola'}, 
            {Id : 'NiharikaId', Name : 'Niharika Srivastava'}, 
        ],
        actions:[ 
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' }
        ]
    };

    handleApprove(){
        console.log('Inside handleApprove')
        generateApprovalLetter({recordId : this.recordId})
        .then(result => {
            this.filesList.push(result[0]);
            console.log('Approval Letter Generated', JSON.stringify(result))
            console.log('File List : ', this.filesList)
            if(this.filesList.length>0){
                console.log('File length')
                console.log(this.filesList.length)
                this.successModal = true;
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    closeApprovalModal(){
        this.successModal = false;
    }

    navigateToQueue(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: window.location.origin + "/lightning/n/Common_Queue"
            }
        });
    }
}