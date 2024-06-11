public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, Type, Rating,
                Phone, Website, Email__c
                FROM Account 
                ORDER BY CreatedDate DESC];
    }
 
    
    //@AuraEnabled(Cacheable = true)
    //Creating a queryString where we add fields name as per FieldSet and       fetch accounts as per queryString.
    /*public static List<Account> getAccount() {
        try {
            String queryString = 'select id';
            for (Schema.FieldSetMember fieldSet : SObjectType.Account.FieldSets.Account_Field_Set.getFields()) {
                queryString += ',' + fieldSet.getFieldPath();
            }
            queryString += ' from Account limit 100';
            return Database.query(queryString);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }*/
}