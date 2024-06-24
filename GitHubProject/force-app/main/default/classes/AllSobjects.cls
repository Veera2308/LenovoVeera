public class AllSobjects {
    
    @AuraEnabled
    public static List<String> getObjectName(){
        List<String> objects=new List<String>();
        List<Schema.SObjectType> gd = Schema.getGlobalDescribe().Values();  
        for(SObjectType sot:gd){
            objects.add(sot.getDescribe().getName());
            objects.sort();
        }
        return objects;
    }
    @AuraEnabled
    public static List<String> getObjectField(string objectName){
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        List<string> fieldsNames = new list<string>();
        
        Map <String, Schema.SObjectField> fieldMap = schemaMap.get(objectName).getDescribe().fields.getMap();
        for(Schema.SObjectField sfield : fieldMap.Values())
        {
            schema.describefieldresult dfield = sfield.getDescribe();
            fieldsNames.add(dfield.getName());
            
        }
        system.debug('Apex '+fieldsNames);
        return fieldsNames;
    }
    
    @AuraEnabled
    public static list<sObject> getRecords(string query){
        system.debug(query);
        List<sObject> sobjList = Database.query(query);
        system.debug(sobjList);
        return sobjList;
    }
    
   
    
        }