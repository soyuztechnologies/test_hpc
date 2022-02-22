sap.ui.define([
    'hpc/sd/sales/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment'
], function(BaseController, MessageBox, MessageToast, Fragment) {
    'use strict';
    return BaseController.extend("hpc.sd.sales.controller.Add",{
        onInit: function(){
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                "productData": {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000051",
                    "SUPPLIER_NAME" : "TECUM",
                    "PRICE" : "0.00",
                    "CURRENCY_CODE" : "INR"
                }
            });
            this.getView().setModel(oModel, "local");
        },
        onGetMost: function(){
            var oDataModel = this.getView().getModel();
            var that = this;
            oDataModel.callFunction("/GetMostExpensiveProduct",{
                urlParameters: {
                    "I_CATEGORY": "Mice"
                },
                success: function(data){
                    var oLocal = that.getView().getModel("local");
                    oLocal.setProperty("/productData", data);
                    that.getView().byId("idSave").setText("Update");
                    that.productId = sText;
                    that.mode = "update";
                }
            })
        },
        productId: "",
        onSave: function(){
            //Step 1: Prepare the payload to be sent
            var oModel = this.getView().getModel("local");
            var payload = oModel.getProperty("/productData");
            //Step 2: Checks
            if(payload.PRODUCT_ID === ""){
                MessageBox.error("please enter product id");
                return;
            }
            //Step 3: get the odata model which is default model for the app
            var oDataModel = this.getView().getModel();
            if(this.mode === "create"){
                //Step 4: Trigger a post call
                oDataModel.create("/ProductSet", payload, {
                    //Step 5: Handle the response - SUCCESS or ERROR
                    success: function(data){
                        MessageToast.show("You made it HPCians!");
                    },
                    error: function(oErr){
                        var errJson = JSON.parse(oErr.responseText);
                        var sMsg = errJson.error.innererror.errordetails[0].message;
                        MessageBox.error(sMsg);
                    }
                });
            }else{
                oDataModel.update("/ProductSet('" + this.productId + "')", payload, {
                    //Step 5: Handle the response - SUCCESS or ERROR
                    success: function(data){
                        MessageToast.show("You have updated product data");
                    },
                    error: function(oErr){
                        var errJson = JSON.parse(oErr.responseText);
                        var sMsg = errJson.error.innererror.errordetails[0].message;
                        MessageBox.error(sMsg);
                    }
                });
            }

            
            
        },
        onClear: function(){
            this.mode = "create";
            this.getView().byId("idSave").setText("Create");
            this.productId = "";
            var oModel = this.getView().getModel("local");
            oModel.setProperty("/productData",
                 {
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000051",
                    "SUPPLIER_NAME" : "TECUM",
                    "PRICE" : "0.00",
                    "CURRENCY_CODE" : "INR"
                }
            );
        },
        onDelete: function(){
            //Step 1: Get the product ID to be deleted
            var productId = this.getView().getModel("local").getProperty("/productData/PRODUCT_ID");
            //Step 2: Get The odata model object
            var oDataModel = this.getView().getModel();
            var that = this;
            //Step 3: Call the delete request to server from odata model
            oDataModel.remove("/ProductSet('" + productId + "')",{
                success: function(){
                    MessageBox.confirm("It was deleted 😊😊");
                    that.onClear();
                }
            })
            //Step 4: Handle the response
        },
        oCities : null,
        oField : null,
        onConfirm: function (oEvent) {
            //debugger;
            if(oEvent.getSource().getId() === 'bp--dialog'){
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sText = oSelectedItem.getLabel();
                //this.oField.setValue(sText);
                this.getView().getModel("local").setProperty("/productData/SUPPLIER_ID", sText);
                this.getView().getModel("local").setProperty("/productData/SUPPLIER_NAME", oSelectedItem.getValue());
            }
          
        },
        onF4Help: function (oEvent) {
            this.oField = oEvent.getSource();
            //MessageBox.confirm("This functionality is under construction");
            var that = this;
            if(!this.oCities){
                Fragment.load({
                    id: "bp",
                    name: 'hpc.sd.sales.fragments.popup',
                    controller: this
                })
                //use of promise in sap ui5
                .then(function(oFragment){
                    //In asyc functions we cannot access the global variables
                    //we have to create a local variable in caller function, which is accessible inside callbacks
                    that.oCities = oFragment;
                    //Grant access of view resources (e.g. model) to fragment
                    that.getView().addDependent(that.oCities);
                    that.oCities.setTitle("Business Partners");
                    //binding to get items in the list
                    that.oCities.bindAggregation("items",{
                        path: '/SupplierSet',
                        template: new sap.m.DisplayListItem({
                            label: "{BP_ID}",
                            value: "{COMPANY_NAME}"
                        })
                    });
                    that.oCities.open();
                });
            }else{
                that.oCities.open();
            }      
        },
        mode:"create",
        onEnter: function(oEvent){
            var sText = oEvent.getParameter("value");
             //Step 3: get the odata model which is default model for the app
             var oDataModel = this.getView().getModel();
             //Step 4: Trigger a post call
             var that = this;
             oDataModel.read("/ProductSet('" + sText + "')",  {
                 //Step 5: Handle the response - SUCCESS or ERROR
                 success: function(data){
                    var oLocal = that.getView().getModel("local");
                    oLocal.setProperty("/productData", data);
                    that.getView().byId("idSave").setText("Update");
                    that.productId = sText;
                    that.mode = "update";
                 },
                 error: function(oErr){
                     var errJson = JSON.parse(oErr.responseText);
                     var sMsg = errJson.error.innererror.errordetails[0].message;
                     MessageBox.error(sMsg);
                 }
             });
        }
    });
});