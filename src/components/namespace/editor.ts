import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';
import Label from '../../shared/labels';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    nodename: string;
    cluster: string;
    name: string;
    labels: Label[];
}


const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'kubernetes',
    color: "#5f8dec",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
        name: { value: "" },
        labels : { value: [{key: "", value:""}] },
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.nodename||Controller.name;
    },
    oneditprepare: function() {
        function resizeConfig(config) {
            const newWidth = config.width();
            config.find('.red-ui-typedInput').typedInput("width",newWidth-150);

        }
        $('#node-input-labels-container').css('min-height','150px').css('min-width','450px').editableList({
            addItem: function(container,i,property: JQuery<HTMLElement>) {
                const row1 = $('<div/>').appendTo(container);
                const row2 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);

                $('<label/>',{for:"node-input-labels-key",style:"width:110px; margin-right:10px;"}).text("Key").appendTo(row1);

                const propertyKey = $('<input/>',{style:"width:250px",class:"node-input-labels-key",type:"text"})
                    .appendTo(row1);

                $('<label/>',{for:"node-input-labels-value",style:"width:110px; margin-right:10px;"}).text("Value").appendTo(row2);
                const propertyValue = $('<input/>',{style:"width:250px",class:"node-input-labels-value",type:"text"})
                    .appendTo(row2);

                //propertyKey.typedInput('value',property.key);
                //propertyValue.typedInput('value',property.value);

                const newWidth = $("#node-input-labels-container").width();
                resizeConfig(container);
            },
            resizeItem: resizeConfig,
            removable: true,
            sortable: false
        });

        $("#node-input-labels-container").editableList('addItems',this.labels);
    },
    oneditsave: function() {
        const properties = $("#node-input-labels-container").editableList('items');

        properties.each(function(i) {
            const property = $(this);
            const v: Label = {
                key: property.find(".node-input-labels-key").val().toString(),
                value: property.find(".node-input-labels-value").val().toString()
            };
            console.log(v)
            node.labels.push(v);

        });
    },
}

export default NamespaceEditor;
