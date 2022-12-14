import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    cluster: string;
    nodename: string;

    action: string;
}


const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'kubernetes',
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
        action: {value: "-"},
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.nodename||Controller.name;
    },
    oneditprepare: function() {
        // Example how to add a new row on action selection using switch
        // select action and show/hide the appropriate form
        // function selectAction(ev: Event) {
        //  var t = ev.target as HTMLSelectElement; // convert to basic element
        //
        //  var container = $('#node-input-action-configuration')
        //     container.empty();
        //  var row1 = $('<div/>').appendTo(container);
        //  ('<label/>',{for:"node-input-create",style:"width:110px; margin-right:10px;"}).text("Create").appendTo(row1);
        //  ('<input/>',{style:"width:250px",class:"node-input-create",type:"text"})
        //   .appendTo(row1)
        //   .typedInput({types:['global']});
        // }

        // Action config container
        const container = $('#node-input-config-container')

        const row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row1);
        const propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action",
        // Add event listener to render the correct fields
            onchange: function() {
                // event listener for example above
                // addEventListener('change', selectAction);
            }})
        .appendTo(row1);

        Controller.actions.forEach(action => {
            propertyAction.append($('<option>', {
                value: action,
                text : action,
            })).appendTo(row1);
        });

        propertyAction.val(this.action);
    },
    oneditsave: function() {
        // Find client source details
        const property = $("#node-input-config-container");
        const node = this; // eslint-disable-line
        node.action = property.find(".node-input-action :selected").text();

    },
}

export default NamespaceEditor;
