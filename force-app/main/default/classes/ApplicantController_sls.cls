public with sharing class ApplicantController_sls {

    //inserts a vfpage document as a file in a record
    @AuraEnabled(Cacheable=false)
    public static List<DocWrapper> generateApprovalLetter(String recordId){            
        try {
                //Defining the vfpage to be added in the record
                Pagereference pdf = Page.ApprovalLetter;
                //if you pass a parameter in the vfpage
                //pdf.getParameters().put('Id',recordId);
                pdf.setRedirect(true);
                Blob b;
                if(Test.isRunningTest()) 
                    b = blob.valueOf('Unit.Test');
                else
                    b = pdf.getContent();
                System.debug(LoggingLevel.DEBUG,'Page---->'+pdf);
                //Inserting the document
                ContentVersion contentVersionRec = new ContentVersion(Title= 'Approval Letter',PathOnClient ='ApprovalLetter.pdf',VersionData = b);
                if(Schema.sObjectType.ContentVersion.isCreateable())
                insert contentVersionRec;
                ContentVersion contentVersionRecord = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE Id = :contentVersionRec.Id LIMIT 1];
                ContentDocumentLink contentlink = new ContentDocumentLink();
                contentlink.LinkedEntityId = recordId;
                contentlink.contentdocumentid = contentVersionRecord.contentdocumentId;
                if(Schema.sObjectType.ContentDocumentLink.isCreateable())
                {contentlink.ShareType = 'V';
                insert contentlink;
                }
                
                //To get the details of the inserted document
                ContentDistribution cd = new ContentDistribution();
                cd.Name = 'PublicShare';
                cd.ContentVersionId = contentVersionRecord.Id;
                cd.PreferencesAllowViewInBrowser= true;
                cd.PreferencesLinkLatestVersion=true;
                cd.PreferencesNotifyOnVisit=false;
                cd.PreferencesPasswordRequired=false;
                cd.PreferencesAllowOriginalDownload= true;
                insert cd;
                List<ContentDistribution> ContentDistributionList= [SELECT DistributionPublicUrl, ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE ContentVersionId =:contentVersionRecord.Id LIMIT 1];
                //Set the details in the wrapper class
                List<DocWrapper> docList = new  List<DocWrapper>();
                DocWrapper docwrap = new DocWrapper();
                docwrap.title = 'Approval Letter';
                docwrap.ContentDocumentId = contentVersionRecord.contentdocumentId;
                docwrap.DownloadURL = ContentDistributionList[0].ContentDownloadUrl;
                docwrap.publicURL = ContentDistributionList[0].DistributionPublicUrl;
                docList.add(docwrap);
                return docList;  

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<DocWrapper> getContentVersion(String recordId){
        try {
            System.debug('recordId->'+recordId);
            Set<Id> ContentDocIDSEt=new Set<Id>();
            Set<String> latestpublishesVerIds=new Set<String>();
            for(ContentDocumentLink cdl:[SELECT Id, LinkedEntityId, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: String.escapeSingleQuotes(recordId) WITH SECURITY_ENFORCED LIMIT 1000]){
                ContentDocIDSEt.add(cdl.ContentDocumentId);
            }
            List<DocWrapper> wrapper=new List<DocWrapper>();
            if(ContentDocIDSEt != null){
           for(ContentDocument cdoc: [SELECT Id, LatestPublishedVersionId FROM ContentDocument WHERE Id in:ContentDocIDSEt WITH SECURITY_ENFORCED LIMIT 1000]){
            latestpublishesVerIds.add(cdoc.LatestPublishedVersionId);
           }
            List<ContentVersion> cVersion = [SELECT Id,title, ContentBodyId, ContentDocumentId, FileType FROM ContentVersion WHERE Id in :latestpublishesVerIds WITH SECURITY_ENFORCED LIMIT 1000];
            Set<string> versionscontent=new Set<string>();
            for(ContentVersion cvObj:cVersion){
                versionscontent.add(cvObj.id);
           }
            List<ContentDistribution> CdList=new List<ContentDistribution>();
            map<String,String> versionIdNTitle=new map<String,String>();
            map<String,String> versionIdNDocId=new map<String,String>();
            Set<string> alreadyPresentDistributionsset=new Set<string> ();

            List<ContentDistribution> alreadyPresentDistributions=[SELECT DistributionPublicUrl, ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE ContentVersionId in:versionscontent];
            for(ContentDistribution cdobj:alreadyPresentDistributions){
                alreadyPresentDistributionsset.add(cdobj.ContentVersionId);
             }
            for(ContentVersion cv : cVersion){
                versionIdNTitle.put(cv.id,cv.title);
                versionIdNDocId.put(cv.id,cv.ContentDocumentId);

              if(!alreadyPresentDistributionsset.contains(cv.id)){
                    ContentDistribution cd = new ContentDistribution();
                    cd.Name = 'PublicShare';
                    cd.ContentVersionId = cv.id;
                    cd.PreferencesAllowViewInBrowser= true;
                    cd.PreferencesLinkLatestVersion=true;
                    cd.PreferencesNotifyOnVisit=false;
                    cd.PreferencesPasswordRequired=false;
                    cd.PreferencesAllowOriginalDownload= true;
                    CdList.add(cd);
                }
        }
            insert CdList;
            List<ContentDistribution> ContentDistributionList= [SELECT DistributionPublicUrl, ContentDownloadUrl,ContentVersionId FROM ContentDistribution WHERE ContentVersionId in:versionscontent];
            for(ContentDistribution obj:ContentDistributionList){
                DocWrapper docwrap=new  DocWrapper();
                docwrap.title=versionIdNTitle.get(obj.ContentVersionId);
                docwrap.ContentDocumentId=versionIdNDocId.get(obj.ContentVersionId);
                docwrap.DownloadURL=obj.ContentDownloadUrl;
                docwrap.publicURL=obj.DistributionPublicUrl;
                wrapper.add(docwrap);
           }          
        }
            return wrapper;
        } catch (Exception e) {
            return null;
        }
    }

    class DocWrapper{
        @AuraEnabled public string title;
        @AuraEnabled public string ContentDocumentId;
        @AuraEnabled public string DownloadURL;
        @AuraEnabled public string publicURL;
    }
}
