import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../cluster-config/types';

export interface ConfigMapEditorProperties extends EditorNodeProperties {
    cluster: string;

    action: string;
    namespace: string;
}


const ConfigMapEditor: EditorNodeDef<ConfigMapEditorProperties> = {
    category: 'kubernetes',
    color: '#a6bbcc',
    defaults: {
        name: {value:""},
        namespace: {value:"default"},
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
        // Action config container
        var container = $('#node-input-config-container')

        var row1 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-action",style:"width:110px; margin-right:10px;"}).text("Action").appendTo(row1);
        var propertyAction = $('<select/>',{style:"width:250px",class:"node-input-action",})
        .appendTo(row1);

        Controller.actions.forEach(action => {
            propertyAction.append($('<option>', {
                value: action,
                text : action,
            })).appendTo(row1);
        });

        var row2 = $('<div/>').appendTo(container);
        $('<label/>',{for:"node-input-namespace",style:"width:110px; margin-right:10px;"}).text("Namespace").appendTo(row1);
        var propertyNamespace = $('<input/>',{style:"width:250px",class:"node-input-namespace",})
        .appendTo(row2);

        propertyNamespace.val(this.namespace);
    },
    oneditsave: function() {
        // Find client source details
        var property = $("#node-input-config-container");
        var node = this;
        node.action = property.find(".node-input-action :selected").text();
        node.namespace = property.find(".node-input-namespace").text();

    },
}

export default ConfigMapEditor;
