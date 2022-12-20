import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../cluster-config/types';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    cluster: string;

    action: string;
}


const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'kubernetes',
    color: '#a6bbcc',
    defaults: {
        name: {value:""},
        cluster: {value: "", type: ClusterConfigController.name},
        action: {value: "-"},
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||Controller.name;
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
        var container = $('#node-input-config-container')

        var row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row1);
        var propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action",
        // Add event listener to render the correct fields
            onchange: function(ev: Event) {
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
        var property = $("#node-input-config-container");
        var node = this;
        node.action = property.find(".node-input-action :selected").text();

    },
}

export default NamespaceEditor;
