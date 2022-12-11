import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import {NamespaceConfig, Controller} from './types';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    name: string;
    active: boolean;
    config: NamespaceConfig;
}

const defaultNamespaceConfig: NamespaceConfig = {
    sourceClusterName: "", // Name is used as the context name
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
        // Cluster config container
        var container = $('#node-input-config-container')
        var row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-cluster-name-property-type",style:"width:110px; margin-right:10px;"}).text("Name").appendTo(row1);
        var propertyType = $('<input/>',{style:"width:250px",class:"node-input-cluster-name-property-type",type:"text"})
            .appendTo(row1)
            .typedInput({types:['global']});

        propertyType.typedInput('value',this.config.sourceClusterName);
    },
    oneditsave: function() {
        // Find client source details
        var property = $("#node-input-config-container");
        var node = this;
        node.config.sourceClusterName = property.find(".node-input-cluster-name-property-type").typedInput('value');
    },
}

export default NamespaceEditor;
