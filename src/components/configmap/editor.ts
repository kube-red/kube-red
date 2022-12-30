import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';

export interface ConfigMapEditorProperties extends EditorNodeProperties {
    cluster: string;

    action: string;
    namespace: string;
}


const ConfigMapEditor: EditorNodeDef<ConfigMapEditorProperties> = {
    category: 'kubernetes',
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        name: {value:""},
        namespace: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
        action: {value: "-"},
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.name||Controller.name;
    },
    oneditprepare: function() {
        // Action config container
        var container = $('#node-input-config-container')

        var row1 = $('<div/>').appendTo(container);
        var row2 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);

        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row1);
        var propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action"})
            .appendTo(row1);

        Controller.actions.forEach(action => {
            propertyAction.append($('<option>', {
                value: action,
                text : action,
            })).appendTo(row1);
        });

        $('<label/>',{for:"node-input-namespace",style:"width:110px; margin-right:10px;"}).text("Namespace").appendTo(row2);
        var propertyNamespace = $('<input/>',{style:"width:250px",class:"node-input-namespace",type:"text"})
            .appendTo(row2)
            .typedInput({types:['str']});


        propertyNamespace.typedInput('value', this.namespace);
        propertyAction.val(this.action);
    },
    oneditsave: function() {
        // Find client source details
        var property = $("#node-input-config-container");
        var node = this;
        node.action = property.find(".node-input-action :selected").text();
        node.namespace = property.find(".node-input-namespace").typedInput('value');
    },
}

export default ConfigMapEditor;
