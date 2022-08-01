import { LightningElement } from 'lwc';

export default class ProfessionalInformation_sls extends LightningElement {

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
}