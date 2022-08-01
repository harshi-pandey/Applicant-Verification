import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RaiseQuery_sls extends LightningElement {

    @api queryData;
    descMissing;
    approvalMissing;
    approvalAuthority;
    approvalAuthorityName;
    @api approvalAuthorityList;
    @api notifyAuthorityList;
    queryMissing;

    closeModal() {
        this.dispatchEvent( new CustomEvent('queryclosed') );
    }

    handleRaiseQuery(){
        this.descMissing = false;
        this.approvalMissing = false;
        this.queryMissing = false;
        let desc = this.template.querySelector(".description");
        let query = this.template.querySelector(".query");
        if(desc.value == ''){
            this.descMissing = true;
        }
        if(query.value == null || query.value == ''){
            this.queryMissing = true;
        }
        if(this.approvalAuthority == null){
            this.approvalMissing = true;
        }
        if(query.value!='' && desc.value!='' && this.approvalAuthority!=null){
            const evt = new ShowToastEvent({
                title: 'Query Raised Successfully!',
                message: 'Approval Authority : '+ this.approvalAuthorityName,
                variant: 'success',
            });
            this.dispatchEvent(evt);
            this.dispatchEvent( new CustomEvent('queryclosed') );
        }
    }

    approvalAuthorityFn(event){
        this.approvalAuthority= event.detail.selectedUserId;
        this.approvalAuthorityName= event.detail.selectedUserName;
        if(this.approvalAuthority)
            this.approvalMissing = false;
    }

    handleDescChange(event){
       if(event.target.value!=''){
            this.descMissing = false;
       }
    }

    handleQueryChange(event){
        if(event.target.value!=''){
             this.queryMissing = false;
        }
    }
}