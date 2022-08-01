public without sharing class lockApplicantController_sls {

    ApexPages.StandardSetController setCon;
    public String recordList { get; private set; }
    public List<String> applicantIds {get;set;}
    public String warningMsg { get; set; }
    public Boolean validList { get; set; }
    public class applicantIdWrapper {
        public String id;
    }

    public lockApplicantController_sls(ApexPages.StandardSetController controller) {
        this.setCon = controller;
        List<Applicant__c> applicantSelectedList = (List<Applicant__c>) this.setCon.getSelected();
        if(applicantSelectedList.isEmpty()){
            validList = false;
            warningMsg = 'Please select an Applicant';
        }else if(applicantSelectedList.size() > 1){
            validList = false;
            warningMsg = 'Please select one Applicant at a time';
        }else{
            validList = true;
            List<applicantIdWrapper> wrapperList = new List<applicantIdWrapper>();
            applicantIds = new List<String>();
            for(Applicant__c applicantSeleted : applicantSelectedList){
                applicantIds.add((String) applicantSeleted.Id);
                applicantIdWrapper records = new applicantIdWrapper();
                records.id = (String) applicantSeleted.Id;
                wrapperList.add(records);
            }            
            recordList = JSON.serialize(wrapperList);
        }
        if(!String.isEmpty(warningMsg) && !validList){
            ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.WARNING, warningMsg);
            ApexPages.addMessage(message);
        }
    }

    @AuraEnabled
    public static Boolean updateApplicant(String applicantId, String userId){
        Boolean success =false;
        try {
            List<Applicant__c> applicantList = [SELECT Id, Locked_By__c FROM Applicant__c WHERE Id =:applicantId LIMIT 1];
            if(applicantList.size()>0){
                if(applicantList[0].Locked_By__c==userId || applicantList[0].Locked_By__c!=null)
                    success = false;      
                else{
                    applicantList[0].Locked_By__c = userId;
                    
                    SObjectAccessDecision accessDecision = Security.stripInaccessible(AccessType.UPDATABLE, applicantList);
                    update accessDecision.getRecords();
                    
                    success = true;
                    }                         
            }    
            return success;       
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public PageReference unlockApplicant(){
        PageReference pgReturnPage;
        String username = '';
        String returnUrl;
        if(applicantIds!=null && !applicantIds.isEmpty() && applicantIds.size()==1){
            Applicant__c ap = [SELECT Id, Locked_By__c, Locked_By__r.Name FROM Applicant__c WHERE Id =:applicantIds];
            returnUrl = '/lightning/n/Action_Queue';
            pgReturnPage = new PageReference(returnUrl);
            pgReturnPage.setRedirect(true);

            List<Applicant__c> apUpdLst = new List<Applicant__c>();
            if(ap.Locked_By__c == UserInfo.getUserId()){
                username = ap.Locked_By__r.Name;
                ap.Locked_By__c = null;   
                apUpdLst.add(ap);
            }
            if(apUpdLst != null && !apUpdLst.isEmpty()){
                SObjectAccessDecision accessDecision = Security.stripInaccessible(AccessType.UPDATABLE, apUpdLst);
                update accessDecision.getRecords();

            }else{
                if((ap.Locked_By__c != Null)){
                    ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.WARNING, 'You cannot Unlock this Lead. It is locked by '+username);
                    ApexPages.addMessage(message);
                    pgReturnPage = null;
                }
                else{
                    ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.WARNING, 'You cannot Unlock this Lead. Its not locked ');
                    ApexPages.addMessage(message);
                    pgReturnPage = null;
                }
            }            
        }else if(applicantIds!=null && !applicantIds.isEmpty() && applicantIds.size()>1){
            ApexPages.Message message = new ApexPages.Message(ApexPages.Severity.WARNING, 'You cannot Select Multiple leads to Unlock');
            ApexPages.addMessage(message);
            pgReturnPage = null;
        }
        return pgReturnPage;
    }  
}
