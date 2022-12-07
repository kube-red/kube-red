import {EditorRED, EditorNodeDef, EditorNodeProperties } from 'node-red';
import ClusterConfig from './types';

declare const RED: EditorRED;

const defaultClusterConfig: ClusterConfig = {
    type: "flow", // Type is either flow or global
    name: "", // Name is used as the context name

    incluster: "false",
    server: "",
    user: "",
    password: "",
}

export interface ClusterConfigEditorProperties extends EditorNodeProperties {
    name: string;
    active: boolean;
    config: ClusterConfig[];

}

const ClusterConfigEditor: EditorNodeDef<ClusterConfigEditorProperties> = {
    category: 'function',
    color: '#7C9A8C',
    defaults: {
        name: {value: ""},
        active: {value: true},
        config: {value: [defaultClusterConfig]},
    },
    inputs:1,
    outputs:0,
    icon: "file.png",
    inputLabels: "trigger",
    label: function() {
        return this.name||"cluster-config";
    },
    oneditprepare: function() {
        function resizeConfig(config: JQuery<HTMLElement>) {
            var newWidth = config.width();
            config.find('.red-ui-typedInput').typedInput("width",newWidth-150);

        }
        $('#node-input-config-container').css('min-height','300px').css('min-width','450px').editableList({
            addItem: function(container: JQuery<HTMLElement>, i:number, property: ClusterConfig) {
                var row1 = $('<div/>').appendTo(container);
                var row2 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row3 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row4 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row5 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row6 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);

                $('<label/>',{for:"node-input-config-property-type",style:"width:110px; margin-right:10px;"}).text("Property").appendTo(row1);
                var propertyType = $('<input/>',{style:"width:250px",class:"node-input-config-property-name",type:"text"})
                    .appendTo(row1)
                    .typedInput({types:['flow','global']});

                $('<label/>',{for:"node-input-config-property-name",style:"width:110px; margin-right:10px;"}).text("Name").appendTo(row2);
                var propertyName = $('<input/>',{style:"width:250px",class:"node-input-config-property-name",type:"text"})
                    .appendTo(row2)
                    .typedInput({types:['str']});

                $('<label/>',{for:"node-input-config-property-incluster",style:"width:110px; margin-right:10px;"}).text("InCluster").appendTo(row3);
                var propertyInCluster = $('<input/>',{style:"width:250px",class:"node-input-config-property-incluster",type:"checkbox"})
                    .appendTo(row3)
                    .typedInput({types:['bool']});


                $('<label/>',{for:"node-input-config-property-server",style:"width:110px; margin-right:10px;"}).text("Server").appendTo(row4);
                var propertyServer = $('<input/>',{style:"width:250px",class:"node-input-config-property-server",type:"text"})
                    .appendTo(row4)
                    .typedInput({types:['str']});

                $('<label/>',{for:"node-input-config-property-user",style:"width:110px; margin-right:10px;"}).text("User").appendTo(row5);
                var propertyUser= $('<input/>',{style:"width:250px",class:"node-input-config-property-user",type:"text"})
                    .appendTo(row5)
                    .typedInput({types:['str']});

                $('<label/>',{for:"node-input-config-property-password",style:"width:110px; margin-right:10px;"}).text("Password").appendTo(row6);
                var propertyPassword = $('<input/>',{style:"width:250px",class:"node-input-config-property-password",type:"text"})
                    .appendTo(row6)
                    .typedInput({types:['str']});



                propertyType.typedInput('value',property.type);
                propertyType.typedInput('type',property.type);
                propertyName.typedInput('value',property.name);
                propertyName.typedInput('type',property.name);
                propertyInCluster.typedInput('value',property.incluster);
                propertyInCluster.typedInput('type',property.incluster);
                propertyServer.typedInput('value',property.server);
                propertyServer.typedInput('type',property.server);
                propertyUser.typedInput('value',property.server);
                propertyUser.typedInput('type',property.server);
                propertyPassword.typedInput('value',property.server);
                propertyPassword.typedInput('type',property.server);

                var newWidth = $("#node-input-config-container").width();
                resizeConfig(container);
            },
            resizeItem: resizeConfig,
            removable: true,
            sortable: false
        });

        $("#node-input-config-container").editableList('addItems', this.config);
    },
    oneditsave: function() {
        var properties = $("#node-input-config-container").editableList('items');
        var node = this;
        node.config = [];
        properties.each(function(i) {
            var property = $(this);
            var p: ClusterConfig = {
                type: property.find(".node-input-config-property-type").typedInput('value'),
                name: property.find(".node-input-config-property-name").typedInput('value'),
                incluster: property.find(".node-input-config-property-incluster").typedInput('value'),
                server: property.find(".node-input-config-property-server").typedInput('value'),
                user: property.find(".node-input-config-property-user").typedInput('value'),
                password: property.find(".node-input-config-property-password").typedInput('value'),
            };
            node.config.push(p);
        });
    },
    button: {
        onclick: function() {
            $.ajax({
                url: "config/"+this.id,
                type:"POST",
                success: function(resp) {
                    RED.notify("Configuration reset","success");
                },
                error: function(jqXHR,textStatus,errorThrown) {
                    if (jqXHR.status == 404) {
                        RED.notify("Node not deployed","error");
                    } else if (jqXHR.status == 500) {
                        RED.notify("Configuration reset failed","error");
                    } else if (jqXHR.status == 0) {
                        RED.notify("No response","error");
                    } else {
                        RED.notify("Unexpected error " + textStatus,"error");
                    }
                }
            });
        }
    }
}

export default ClusterConfigEditor;
