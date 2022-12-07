import {EditorRED, EditorNodeDef, EditorNodeProperties } from 'node-red';
import ClusterConfig from './types';

declare const RED: EditorRED;

const defaultClusterConfig: ClusterConfig = {
    type: "flow", // Type is either flow or global
    typeValue: "", // Name is used as the context name

    incluster: "false",
    clustername: "",
    server: "",
    user: "",
    password: "",
}

export interface ClusterConfigBasicEditorProperties extends EditorNodeProperties {
    name: string;
    active: boolean;
    config: ClusterConfig[];
}

const ClusterConfigBasicEditor: EditorNodeDef<ClusterConfigBasicEditorProperties> = {
    category: 'function',
    color: '#7C9A8C',
    defaults: {
        name: {value: ""},
        active: {value: true},
        config: {value: [defaultClusterConfig]},
    },
    inputs:0,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"cluster-config";
    },
    oneditprepare: function() {
        function resizeConfig(config: JQuery<HTMLElement>) {
            var newWidth = config.width();
            config.find('.red-ui-typedInput').typedInput("width",newWidth-150);

        }
        // very verbose but it works for now :shrug:
        $('#node-input-config-container').css('min-height','300px').css('min-width','450px').editableList({
            addItem: function(container: JQuery<HTMLElement>, i:number, property: ClusterConfig) {
                var row1 = $('<div/>').appendTo(container);
                var row2 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row3 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row4 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row5 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);
                var row6 = $('<div/>',{style:"margin-top:8px;"}).appendTo(container);

                // this is used to set either flow or global context. Type is flow type and `value` is variable name used in context
                $('<label/>',{for:"node-input-config-property-type",style:"width:110px; margin-right:10px;"}).text("Property").appendTo(row1);
                var propertyType = $('<input/>',{style:"width:250px",class:"node-input-config-property-type",type:"text"})
                    .appendTo(row1)
                    .typedInput({types:['flow','global']});

                // all these are just variables that are used to construct kubeconfig. They are mostly strings and not used in context.
                // TODO: validate those
                // TODO: Construct kubeconfig in controller before setting to context
                $('<label/>',{for:"node-input-config-property-incluster",style:"width:110px; margin-right:10px;"}).text("InCluster").appendTo(row2);
                var propertyInCluster = $('<input/>',{style:"width:250px",class:"node-input-config-property-incluster",type:"checkbox"})
                    .appendTo(row2)
                    .typedInput({types:['bool']});

                $('<label/>',{for:"node-input-config-property-clustername",style:"width:110px; margin-right:10px;"}).text("Cluster Name").appendTo(row3);
                var propertyClustername = $('<input/>',{style:"width:250px",class:"node-input-config-property-clustername",type:"text"})
                    .appendTo(row3)
                    .typedInput({types:['str']});

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



                propertyType.typedInput('value', property.typeValue);
                propertyType.typedInput('type',property.type);

                propertyInCluster.typedInput('value',property.incluster);
                propertyInCluster.typedInput('type',property.incluster);
                propertyClustername.typedInput('value',property.clustername);
                propertyClustername.typedInput('type',property.clustername);

                propertyServer.typedInput('value',property.server);
                propertyServer.typedInput('type',property.server);
                propertyUser.typedInput('value',property.user);
                propertyUser.typedInput('type',property.user);
                propertyPassword.typedInput('value',property.password);
                propertyPassword.typedInput('type',property.password);

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
        properties.each(function(i) {
            var property = $(this);
            node.config = []
            var p: ClusterConfig = {
                type: property.find(".node-input-config-property-type").typedInput('type'),
                typeValue: property.find(".node-input-config-property-type").typedInput('value'),

                incluster: property.find(".node-input-config-property-incluster").typedInput('value'),
                clustername: property.find(".node-input-config-property-clustername").typedInput('value'),
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

export default ClusterConfigBasicEditor;
