sap.ui.define([
    'hpc/sd/sales/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
	'sap/m/Token',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(BaseController, MessageBox, MessageToast, Token, Fragment, Filter, FilterOperator) {
    'use strict';
    return BaseController.extend("hpc.sd.sales.controller.View2",{
        onInit: function (params) {
            var oView = this.getView();
			var oMultiInput1 = oView.byId("multiInput1");
			oMultiInput1.setTokens([
				new Token({text: "Token 1", key: "0001"}),
				new Token({text: "Token 2", key: "0002"})
			]);
            
            //get the object of the router from Component.js
            this.oRouter = this.getOwnerComponent().getRouter();
            //Attach an event handler which gets called everytime 
            //the route changes, Route can change because of 
            //1- when browser back and forward pressed
            //2- when item selected by user
            //3- when user manually change index in url of page
            //4- when app starts with detail route
            
            this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
            
        },
        oSupplierPopup: null,
        oCities: null,
        oField: null,
        onFilter: function (oEvent) {
            //MessageBox.confirm("This functionality is under construction");
            var that = this;
            if(!this.oSupplierPopup){
                Fragment.load({
                    id: "supplier",
                    name: 'hpc.sd.sales.fragments.popup',
                    controller: this
                })
                //use of promise in sap ui5
                .then(function(oFragment){
                    //In asyc functions we cannot access the global variables
                    //we have to create a local variable in caller function, which is accessible inside callbacks
                    that.oSupplierPopup = oFragment;
                    //Grant access of view resources (e.g. model) to fragment
                    that.getView().addDependent(that.oSupplierPopup);
                    that.oSupplierPopup.setTitle("Suppliers");
                    //binding to get items in the list
                    that.oSupplierPopup.bindAggregation("items",{
                        path: '/suppliers',
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{city}"
                        })
                    });
                    that.oSupplierPopup.open();
                });
            }else{
                that.oSupplierPopup.open();
            }      
                  
        },
        onConfirm: function (oEvent) {
            //debugger;
            if(oEvent.getSource().getId() === 'cities--dialog'){
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sText = oSelectedItem.getLabel();
                this.oField.setValue(sText);
            }
          
        },
        onPopupSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oDialog = oEvent.getSource();
            var oFilter = new Filter("name", FilterOperator.Contains, sValue);
            oDialog.getBinding("items").filter(oFilter);
        },
        onF4Help: function (oEvent) {
            this.oField = oEvent.getSource();
            //MessageBox.confirm("This functionality is under construction");
            var that = this;
            if(!this.oCities){
                Fragment.load({
                    id: "cities",
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
                    that.oCities.setTitle("Cities");
                    //binding to get items in the list
                    that.oCities.bindAggregation("items",{
                        path: '/cities',
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                        })
                    });
                    that.oCities.open();
                });
            }else{
                that.oCities.open();
            }      
        },
        herculis: function (oEvent) {
            //debugger;  
            //Extract the fruit id from the url parameter using event object
            //of route matched handler
            var fruitId = oEvent.getParameter("arguments").fruitId;
            //build the element path again
            var sPath = '/' + fruitId;
            //bind the element with view2 itself
            this.getView().bindElement(sPath);
        },
        onBack: function(){
            //Step 1: Get The Container Control object here
            var oAppCon = this.getView().getParent();
            //Step 2: Container will navigate to next view
            oAppCon.to("idView1");
        },
        onSave: function () {
            MessageBox.confirm("Do you want to save it!",{
                onClose: function(status){
                    if(status === "OK"){
                        MessageToast.show("Your order has been placed successfully!");
                    }
                }
            });
        },
        onCancel: function () {
            MessageBox.error("You have cancelled the save");
        }
    });
});