sap.ui.define([
    'sap/ui/core/UIComponent'
], function(UIComponent) {
    'use strict';
    return UIComponent.extend("hpc.sd.sales.Component",{
        metadata: {
            manifest: "json"
        },
        init: function(){
            //super->constructor()
            //call the base class constructor from child class
            UIComponent.prototype.init.apply(this);
            //Step 1 : get the router object from base classs
            var oRouter = this.getRouter();
            //Step 2: Call the initilize method of router 
            //- The initialize method will SCAN manifest.json to find the routing configuration
            oRouter.initialize();
        },
        // createContent: function () {
            
        //     //Step 1: Create Root view object - App.view.xml
        //     //This has App Container control with id - idAppCon
        //     var oView = new sap.ui.view({
        //         viewName: "hpc.sd.sales.view.App",
        //         type: "XML"
        //     });

        //     //We will add a View1 inside Container control
        //     //Step 2: Create child view object = View 1
        //     var oView1 = new sap.ui.view({
        //         viewName: "hpc.sd.sales.view.View1",
        //         type: "XML",
        //         id: "idView1"
        //     });

        //     //Step 2: Create child view object = View 2
        //     var oView2 = new sap.ui.view({
        //         viewName: "hpc.sd.sales.view.View2",
        //         type: "XML",
        //         id: "idView2"
        //     });

        //     //Step 3: Put it inside the container
        //     var oAppCon = oView.byId("idAppCon");
        //     //Both views added now to container
        //     oAppCon.addMasterPage(oView1).addDetailPage(oView2);

        //     return oView;
        // },
        destroy: function() {
            
        }
    })
});