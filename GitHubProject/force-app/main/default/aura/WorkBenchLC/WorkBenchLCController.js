({
    init: function(component, event, helper) {
        helper.handlerIntiHelper(component, event, helper);
    },
    onChange: function(component, event, helper){
        helper.captureObjectField(component, event, helper);
    },
    
    handleClick: function (component, event, helper) {
        helper.querySelectHelper(component, event, helper);
        component.set("v.test", false);
        //alert("Option selected with value: '" + selectedOptionValue.toString() + "'");
    },
    
    queryClick: function (component, event, helper) {
        helper.displayDataTable(component, event, helper);
    },
    
    sortChange: function (component, event, helper) {
        helper.sortValues(component, event, helper);
    },
    
    ascDescChange: function (component, event, helper) {
        helper.ascdscValues(component, event, helper);
    },
    
    nullChange: function (component, event, helper) {
        helper.nullValues(component, event, helper);
    },
    
    limitChange: function (component, event, helper) {
        helper.limitValues(component, event, helper);
    },
    filterChange: function (component, event, helper) {
        helper.filterValues(component, event, helper);
    },
    inputChange: function (component, event, helper) {
        helper.inputValues(component, event, helper);
    },
    operatorChange: function (component, event, helper) {
        helper.operatorValues(component, event, helper);
    },
    utilityHandler: function (component, event, helper) {
        helper.utilityValues(component, event, helper);
    },
    
    handleObjectSelect : function(component, event, helper){
        helper.handleObjectValue(component, event, helper);
        //alert('You pressed:'+event.getSource().get("v.value"));
    }
})