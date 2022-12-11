import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import {NamespaceConfig, Controller} from './types';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    name: string;
    active: boolean;
    config: NamespaceConfig;
}

const defaultNamespaceConfig: NamespaceConfig = {
    sourceClusterName: "kubeconfig", // Name is used as the context name
    action: "create",
}


const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'function',
    color: '#a6bbcf',
    defaults: {
        name: {value:""},
        active: {value:true},
        config: {value: defaultNamespaceConfig},
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||Controller.name;
    },
    oneditprepare: function() {
        var action: string
        function selectAction(ev: Event) {
           var t = ev.target as HTMLSelectElement; // convert to basic element
           var container = $('#node-input-action-configuration')
           container.empty();

           var row1 = $('<div/>').appendTo(container);
           switch(t.value) {
                case "create":
                    $('<label/>',{for:"node-input-create",style:"width:110px; margin-right:10px;"}).text("Create").appendTo(row1);
                    $('<input/>',{style:"width:250px",class:"node-input-create",type:"text"})
                        .appendTo(row1)
                        .typedInput({types:['global']});
                case "delete":
                    $('<label/>',{for:"node-input-delete",style:"width:110px; margin-right:10px;"}).text("Delete").appendTo(row1);
                    $('<input/>',{style:"width:250px",class:"node-input-delete",type:"text"})
                    .appendTo(row1)
                    .typedInput({types:['str']});
           }

        }
        // Cluster config container
        // TODO: This will be shared for all nodes/resources. We should move it to a shared file
        var container = $('#node-input-config-container')
        var row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-cluster-name",style:"width:110px; margin-right:10px;"}).text("Cluster").appendTo(row1);
        var propertyType = $('<input/>',{style:"width:250px",class:"node-input-cluster-name",type:"text"})
            .appendTo(row1)
            .typedInput({types:['global']});

        var row2 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row2);
        var propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action",
        // Add event listener to render the correct fields
            onchange: function(ev: Event) {
                addEventListener('change', selectAction);
            }})
        .appendTo(row2);

        var actions = ["create", "delete", "list", "get", "apply", "watch"];
        actions.forEach(action => {
            propertyAction.append($('<option>', {
                value: action,
                text : action,
            })).appendTo(row2);
        });

        propertyType.typedInput('value',this.config.sourceClusterName);
        propertyAction.val(this.config.action);

        // TODO: Preload the correct fields based on the action
        //var action = $("#node-input-action-configuration");

    },
    oneditsave: function() {
        // Find client source details
        var property = $("#node-input-config-container");
        var node = this;
        node.config.sourceClusterName = property.find(".node-input-cluster-name").typedInput('value');
        node.config.action = property.find(".node-input-action :selected").text();

    },
}

export default NamespaceEditor;
