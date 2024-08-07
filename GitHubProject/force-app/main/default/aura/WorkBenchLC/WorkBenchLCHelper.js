({
    handlerIntiHelper : function(component, event, helper) {
        var action = component.get("c.getObjectName");//get-user-->apex set==> apex-->userdispley
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                component.set("v.options", allValues);
            }                    
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    captureObjectField : function(component, event, helper) {
        var action = component.get("c.getObjectField"); //get apex method for field names
        var objectName = component.find('onjId').get('v.value');
        action.setParams({'objectName':objectName});
        action.setCallback(this, function(response) {
            var state = response.getState();
            var opts = [];
            //var selectOne = [];
            /*     selectOne.push({
                        label: 'Select',
                        value: ' '
                    }, ...opts) 
            //selectOne =
             opts = [{
                    label: 'None',
                    value: 'None'
                }];
                */
                
            //console.log(selectOne);
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                //console.log('ewwe '+allValues);
                
                 opts.unshift({
                        label : 'None',
                        value : 'None'
                        });
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        label: allValues[i],
                        value: allValues[i]
                    });
                   
                    component.set("v.listValues", opts);
                    
                }
                
            }                    
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);     
    },       
    
    querySelectHelper : function(component, event, helper) {
        var query = "Select "+component.get("v.values")+" From "+component.get("v.selectedValue");
        if(!query.includes("Select  From")){
            component.set("v.userSelected", query);
        }
    },
    
    
    displayDataTable : function(component, event, helper) {
        
        var action = component.get("c.getRecords");
        var query = component.get('v.userSelected');
        var selectedFields = component.get("v.values");
        
        action.setParams({'query':query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                var allValues = response.getReturnValue();
                console.log(allValues);
                console.log('ewwe '+JSON.stringify(allValues) );
                // var a = JSON.stringify(allValues);
                var column = [];
                //var setItems = new Set();
                /*
                for (const firstkey in allValues) {
                    for(const secondKey in allValues[firstkey]){
                        setItems.add(secondKey);
                    }
                }
                */
                //console.log('set '+Array.from(setItems));
                for(let value in selectedFields){	
                    column.push({
                        label: selectedFields[value], 
                        fieldName: selectedFields[value], 
                        type: typeof selectedFields[value]
                    })
                }
                /*
                for(let value in Array.from(setItems)){	
                    column.push({
                        label: Array.from(setItems)[value], 
                        fieldName: Array.from(setItems)[value], 
                        type: typeof Array.from(setItems)[value]
                    })
                }
                */
                component.set("v.columns", column);
                component.set("v.data", allValues);
                
            }                    
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);     
    },
    
    
    
    sortValues : function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var orderBy = "Select "+fields+" From "+object +' ORDER BY '+orderField;
        var filterOrderBy = "Select "+fields+" From "+object +' WHERE '+filterValue+' '+ operatorValue+" '"+ inputValue + "' ORDER BY "+orderField+' '+ascDec+' '+nullValue;
        
        if(fields != null && object != null){
            if(ascDec != null && nullValue != null && filterValue == null && inputValue == null){
                if(limit != null){
                    checkLimit = orderBy.endsWith("LIMIT ");
                    if(checkLimit){
						component.set("v.userSelected", orderBy);
                    }
                    else{
						var orderBy = orderBy +' '+ascDec+' '+nullValue+' LIMIT '+limit;
						component.set("v.userSelected", orderBy);
                    }
                }
                else{
                    component.set("v.userSelected", orderBy);
                }
                }
            
            else if(filterValue != null && operatorValue != null){
                if(inputValue != null && limit == null){
                    component.set("v.userSelected", filterOrderBy);
                }
                
                else if(inputValue != null && limit != null){
                    filterOrderBy = filterOrderBy +' LIMIT '+limit;
                    var checkLimit = filterOrderBy.endsWith("LIMIT ");
                    //console.log(checkLimit);
                    if(!checkLimit){
                        component.set("v.userSelected", filterOrderBy);
                    }
                    else{
                        var filterOrderBy =  filterOrderBy.replace(/LIMIT/i, " ");
                        component.set("v.userSelected", filterOrderBy);
                    }
                }
            }
        }
        var fieldObj = "Select "+fields+" From "+object;
        if(orderField == 'None' && fieldObj != null){
            if(limit != null && filterValue == null && inputValue == null){
                fieldObj = fieldObj + ' LIMIT '+limit;
                component.set("v.userSelected", fieldObj);
            }
            else if(limit == null && filterValue == null && inputValue == null){
                component.set("v.userSelected", fieldObj);
            }
                else if(filterValue != null && inputValue != null && limit != null){
						fieldObj = fieldObj +' WHERE '+filterValue+' '+operatorValue+" '"+inputValue+"' LIMIT "+limit;
						component.set("v.userSelected", fieldObj);
                }
                    else if(inputValue != null && limit == null){
                        fieldObj +' WHERE '+filterValue+' '+operatorValue+' '+inputValue;
                    }
        }
        
    },
    
    ascdscValues : function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var fieldAscDsc = "Select "+fields+" From "+object;
        var ascDsc = fieldAscDsc +' ORDER BY '+orderField+' '+ascDec+' '+nullValue+' LIMIT '+limit;
        var ascDscNull = fieldAscDsc+' ORDER BY '+orderField+' '+ascDec+' '+nullValue;
        var filterAscDsc = fieldAscDsc+' WHERE '+ filterValue+' '+ operatorValue+" '"+ inputValue + "' ORDER BY "+orderField+' '+ascDec+' '+nullValue;
        
        if(fieldAscDsc != null){
            if(orderField != null && filterValue == null){
                if(limit != null){
                    checkLimit = ascDsc.endsWith("LIMIT ");
                    if(checkLimit){
						component.set("v.userSelected", ascDscNull);
                    }
                    else{
						component.set("v.userSelected", ascDsc);
                    }
                }
                else{
                    component.set("v.userSelected", ascDscNull);
                    //console.log('ascDscNull '+ascDscNull);
                }
            }
            else if(filterValue != null && operatorValue != null){
                if(inputValue != null && limit == null){
                    component.set("v.userSelected", filterAscDsc);
                    //console.log('filterAscDsc '+filterAscDsc);
                }
                else if(inputValue != null && limit != null){
                    filterAscDsc = filterAscDsc +' LIMIT '+limit;
                    var checkLimit = ascDsc.endsWith("LIMIT ");
                    if(!checkLimit){
                        component.set("v.userSelected", filterAscDsc);
                    }
                    else{
                        var filterAscDsc =  filterAscDsc.replace(/LIMIT/i, " ");
                        component.set("v.userSelected", filterAscDsc);
                    }
                }
                
            }
            
        }
        
    },
    
    nullValues : function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var fieldNullSelect = "Select "+fields+" From "+object;
        var nullSelect = fieldNullSelect+' ORDER BY '+orderField+' '+ascDec+' '+nullValue;
        var filterNull = fieldNullSelect+' WHERE '+ filterValue+' '+ operatorValue+" '"+ inputValue + "' ORDER BY "+orderField+' '+ascDec+' '+nullValue;
        
        
        if(fieldNullSelect != null){
            if(orderField != null && filterValue == null){
                if(limit != null){
                    checkLimit = nullSelect.endsWith("LIMIT ");
                    if(checkLimit){
						component.set("v.userSelected", nullSelect);
                    }
                    else{
						var nullLimit = nullSelect +' LIMIT '+limit;
						component.set("v.userSelected", nullLimit);
                    }
                }
                else if(limit == null){
                    component.set("v.userSelected", nullSelect);
                }
            }
            else if(filterValue != null && operatorValue != null){
                if(inputValue != null && limit == null && orderField != null){
                    component.set("v.userSelected", filterNull);
                    console.log('filterNull '+filterNull);
                }
                else if(inputValue != null && limit != null){
                    filterNull = filterNull +' LIMIT '+limit;
                    var checkLimit = filterNull.endsWith("LIMIT ");
                    if(!checkLimit){
                        component.set("v.userSelected", filterNull);
                    }
                    else{
                        var filterNull =  filterNull.replace(/LIMIT/i, " ");
                        component.set("v.userSelected", filterNull);
                    }
                }
                
            }
        }        
        
    },
    
    limitValues : function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var fieldLimitSelect = "SELECT "+fields+" FROM "+object;
        var nullSelect = fieldLimitSelect+' ORDER BY '+orderField+' '+ascDec+' '+nullValue+' LIMIT '+limit;
        var filterLimit = fieldLimitSelect+' WHERE '+ filterValue+' '+ operatorValue+" '"+ inputValue + "' ORDER BY "+orderField+' '+ascDec+' '+nullValue+' LIMIT '+limit;
        
        
        if(fieldLimitSelect != null){
            if(orderField != null && filterValue == null){
                if(nullSelect != null){
                    var checkLimit = nullSelect.endsWith("LIMIT ");
                    if(!checkLimit){
                        console.log('1');
                    component.set("v.userSelected", nullSelect);
                    }
                    else{
                        var nullSelect =  nullSelect.replace(/LIMIT/i, " ");
                        console.log('2');
                        component.set("v.userSelected", nullSelect);
                    }
                }
            }
            else if(filterValue != null && operatorValue != null && (orderField != null || orderField != 'None')){
               
                 if(inputValue != null && limit != null){
                    var checkLimit = filterLimit.endsWith("LIMIT ");
                    if(!checkLimit ){
                        console.log('4');
                        component.set("v.userSelected", filterLimit);
                    }
                    else{
                        var filterLimit =  filterLimit.replace(/LIMIT/i, " ");
                        console.log('5');
                        component.set("v.userSelected", filterLimit);
                    }
                }
                
            }
        }        
        
        //$A.util.isEmpty(component.find('onSortId').get('v.value')
    },
    
    filterValues: function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var fieldObj = "Select "+fields+" From "+object;
        if(filterValue == 'None' && fieldObj != null){
            if(limit != null && orderField == null){
                fieldObj = fieldObj + ' LIMIT '+limit;
                component.set("v.userSelected", fieldObj);
            }
            else if(limit == null && orderField == null){
                component.set("v.userSelected", fieldObj);
            }
                else if(orderField != null && limit != null){
                    fieldObj = fieldObj +' ORDERBY '+orderField+' '+ascDec+' '+nullValue+' LIMIT '+limit;
                    component.set("v.userSelected", fieldObj);
                }
                    else if(inputValue != null && limit == null){
                        fieldObj +' ORDERBY '+orderField+' '+ascDec+' '+nullValue;
                    }
        }
        
    },
    operatorValues: function(component, event, helper) {
        
        
    },
    inputValues: function(component, event, helper) {
        var fields = component.get("v.values");
        var object = component.get("v.selectedValue");
        var filterValue = component.find("onFilterId").get("v.value");
        var operatorValue = component.find("onOperatorId").get("v.value");
        var inputValue = component.find("onFilterTextId").get("v.value");
        var orderField = component.find('onSortId').get('v.value');
        var ascDec = component.find('onArrangeId').get('v.value');
        var nullValue = component.find('onNullId').get('v.value')
        var limit = component.find("onNumberId").get("v.value");
        
        var updateLimitSelected = '';
        if(fields != null && object != null && filterValue != null && operatorValue != null && inputValue  != null && orderField != null && ascDec != null && nullValue != null){
            if(limit != null){
                updateLimitSelected = "Select "+fields+" From "+object +' WHERE '+ filterValue+' '+ operatorValue+"'"+ inputValue+"' ORDER BY "+orderField +' '+ascDec+' '+nullValue+' LIMIT '+limit;
                component.set("v.userSelected", updateLimitSelected);
            }
            else if(limit == null){
                console.log(typeof inputValue);
                updateLimitSelected = "Select "+fields+" From "+object +' WHERE '+ filterValue+' '+ operatorValue+' " '+ inputValue +' " ORDER BY '+orderField +' '+ascDec;
                component.set("v.userSelected", updateLimitSelected);
           }
            if(inputValue  == ''){
                updateLimitSelected = "Select "+fields+" From "+object +' ORDER BY '+orderField +' '+ascDec+' '+nullValue+' LIMIT '+limit;
                var checkLimit = updateLimitSelected.endsWith("LIMIT ");
                    if(!checkLimit ){
                        console.log('4');
                        component.set("v.userSelected", updateLimitSelected);
                    }
                    else{
                        var updateLimitSelected =  updateLimitSelected.replace(/LIMIT/i, " ");
                        console.log('5');
                        component.set("v.userSelected", updateLimitSelected);
                    }
            }
        }
        else if(fields != null && object != null && filterValue != null && operatorValue != null && inputValue  != null ){
            
            updateLimitSelected = "Select "+fields+" From "+object +' WHERE '+ filterValue+' '+ operatorValue+"'"+ inputValue +"'";
            component.set("v.userSelected", updateLimitSelected);
            console.log('Con 2'+updateLimitSelected);
            if(inputValue  == ''){
                updateLimitSelected = "Select "+fields+" From "+object;
                component.set("v.userSelected", updateLimitSelected);
                console.log('con 3 '+updateLimitSelected);
            }
        }
            
    },
    
    
    utilityValues: function(component, event, helper) {
        // Create a Lightning Combobox dynamically
        var comboBoxContainerFilter = component.find("comboBoxContainerFilter");
        var comboBoxContainerOperator = component.find("comboBoxContainerOperator");
        var inputNumber = component.find("inputNumber");
        
        $A.createComponent(
            "lightning:combobox",
            {
                "aura:id": "filterComboBox",
                "class":"selectFilter",
                "label": "Filter result by",
                "name": "Filter result by",
                "options": component.get("v.listValues"),
                //"value": component.get("v.filterLimit"),
                "onchange": component.getReference('c.handleObjectSelect')
                
            },
            function(newComboBox, status, errorMessage){
                if (status === "SUCCESS") {
                    // Add the new component to the container
                    var body = comboBoxContainerFilter.get("v.body");
                    body.push(newComboBox);
                    comboBoxContainerFilter.set("v.body", body);
                } else {
                    console.error(errorMessage);
                }
            }
        );
        
        $A.createComponent(
            "lightning:combobox",
            {
                "aura:id": "operatorComboBox",
                "label": "Operator",
                "name": "Operator",
                "options": component.get("v.operator"),
                "onchange": component.getReference('c.handleObjectSelect')
            },
            function(newComboBox, status, errorMessage){
                if (status === "SUCCESS") {
                    var body = comboBoxContainerOperator.get("v.body");
                    body.push(newComboBox);
                    comboBoxContainerOperator.set("v.body", body);
                } else {
                    console.error(errorMessage);
                }
            }
            
        );
        
        $A.createComponent(
            
            "lightning:input",
            {
                "type":"text",
                "aura:id": "textId",
                "label": "Condition",
                "name": "Condition",
                "onchange":component.getReference("c.handleObjectSelect")
            },
            function(newComboBox, status, errorMessage){
                if (status === "SUCCESS") {
                    // Add the new component to the container
                    var body = inputNumber.get("v.body");
                    body.push(newComboBox);
                    inputNumber.set("v.body", body);
                } else {
                    console.error(errorMessage);
                }
            }
            
        );
    },
    
    handleObjectValue: function(component, event, helper) {
        
       
        var filterCombo = component.find('filterComboBox');
		var operatorCombo = component.find('operatorComboBox');
        var textInput = component.find('textId')
        
        //var filterCombo = event.getSource().get("v.value");
        
        var a = '';
       // console.log("combo ",operatorCombo)
        // 
        for(let i=0;i<filterCombo.length;i++)
        {
            if(filterCombo[i].get("v.value") != null && operatorCombo[i].get("v.value") != null
               && textInput[i].get("v.value") != null){
           // console.log(filterCombo[i].get("v.value") , operatorCombo[i].get("v.value"), textInput[i].get("v.value"))
            a = filterCombo[i].get("v.value") + operatorCombo[i].get("v.value") + textInput[i].get("v.value");
            }
        }
        
        // .get('v.value');
        
        console.log('a '+a);			
        //console.log('filterComboBox '+filterValue);			
        // console.log('operatorComboBox '+operatorCombo);	
         /*
        var a = component.find('filterComboBox').get('v.value');
        console.log('a'+a);
        
        var b = component.find('operatorComboBox').get('v.value');
        console.log('b'+b);
        
        */
    }
    
    //changeOrderType
    
})