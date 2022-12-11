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
        function testFunction() {
            console.log("TEST");
        }
        // Cluster config container
        var container = $('#node-input-config-container')
        var row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-cluster-name",style:"width:110px; margin-right:10px;"}).text("Name").appendTo(row1);
        var propertyType = $('<input/>',{style:"width:250px",class:"node-input-cluster-name",type:"text"})
            .appendTo(row1)
            .typedInput({types:['global']});

        var row2 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row2);
        var propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action",
        // Add event listener to render the correct fields
            onchange: function() {
                addEventListener('change', testFunction);
            }})
        .appendTo(row2);

        propertyAction.append($('<option>', {
                value: "create",
                text : "create",
            })).appendTo(row2);
        propertyAction.append($('<option>', {
                value: "delete",
                text : "delete",
            })).appendTo(row2);
        propertyAction.append($('<option>', {
                value: "list",
                text : "list",
            })).appendTo(row2);

        propertyType.typedInput('value',this.config.sourceClusterName);
        propertyAction.val(this.config.action);
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
