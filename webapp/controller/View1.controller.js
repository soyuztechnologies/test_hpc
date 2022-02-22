sap.ui.define([
    'hpc/sd/sales/controller/BaseController'
], function(BaseController) {
    'use strict';
    return BaseController.extend("hpc.sd.sales.controller.View1",{
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNext: function(sIndex){
            //alert("bhalo");
            //Step 1: Get The Container Control object here
            //var oAppCon = this.getView().getParent();
            //Step 2: Container will navigate to next view
            //oAppCon.to("idView2");
            this.oRouter.navTo("detail",{
                fruitId: sIndex
            });
        },
        onAdd: function(){
            this.oRouter.navTo("addNew");
        },
        onDelete: function(oEvent){
            //step 1: get the object of list item to be deleted
            var oListItemToBeDelete = oEvent.getParameter("listItem");
            //step 2: get the list object
            //var oList = this.getView().byId("idList");
            var oList = oEvent.getSource();
            //step 3: remove the item from the list object
            oList.removeItem(oListItemToBeDelete);
        },
        onSearch: function(oEvent){
            //Step 1: get the value of what is being search by user
            var query = oEvent.getParameter("query");
            //console.log(query);
            //Step 2: Get The list object
            var oList = this.getView().byId("idList");
            //Step 3: We have to build a filter Object
            var oFilter1 = new sap.ui.model.Filter(
                "CATEGORY",
                sap.ui.model.FilterOperator.Contains,
                query
            );
            var oFilter2 = new sap.ui.model.Filter(
                "type",
                sap.ui.model.FilterOperator.Contains,
                query
            );
            var oFilter = new sap.ui.model.Filter(
                {
                    filters: [oFilter1,oFilter2],
                    and: false
                }
            );
            
            //Step 4: We have to Inject this filter object to the List Items
            oList.getBinding("items").filter(oFilter1);
        },
        onItemSelect: function (oEvent) {
            //debugger;
            //Step 1: know the path of the selected element
            var sPath = oEvent.getParameter("listItem").getBindingContextPath();
            //Step 2: Get the object of View2
            //var oSplitApp = this.getView().getParent().getParent();
            //var oView2 = oSplitApp.getDetailPages()[0];
            //Step 3: Perform element binding with view (TABLE --> SIMPLE FORM, LIST --> VIEW2)
            //oView2.bindElement(sPath);
            //Step 4: Already a function to navigate
            //'/fruits/2'
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];
            this.onNext(sIndex);
        }
    });
});