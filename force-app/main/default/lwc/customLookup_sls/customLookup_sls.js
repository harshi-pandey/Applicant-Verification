import { LightningElement, api } from 'lwc';

export default class CustomLookup_sls extends LightningElement {

    @api payload;
    showResult;
    selectedValue = '';

    handleSearch(){
       this.searchResult = this.payload;
       this.showResult = true;
    }

    handleSelectedRecord(event){
        var selectdId =  event.currentTarget.getAttribute("data-id");
        var selectdName =  event.currentTarget.getAttribute("data-name");
        if(selectdId){
            this.selectedValue = selectdName;
            this.showResult = false;
            const passEvent = new CustomEvent('select', {
                detail: {
                    selectedUserId: selectdId,
                    selectedUserName: selectdName
                }
            });
            this.dispatchEvent(passEvent);
        }
    }
}