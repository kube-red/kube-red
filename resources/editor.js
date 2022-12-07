(function () {
    'use strict';

    const defaultClusterConfig = {
        type: "flow",
        typeValue: "",
        incluster: "false",
        clustername: "",
        server: "",
        user: "",
        password: "",
    };
    const ClusterConfigBasicEditor = {
        category: 'function',
        color: '#7C9A8C',
        defaults: {
            name: { value: "" },
            active: { value: true },
            config: { value: [defaultClusterConfig] },
        },
        inputs: 0,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "cluster-config";
        },
        oneditprepare: function () {
            function resizeConfig(config) {
                var newWidth = config.width();
                config.find('.red-ui-typedInput').typedInput("width", newWidth - 150);
            }
            // very verbose but it works for now :shrug:
            $('#node-input-config-container').css('min-height', '300px').css('min-width', '450px').editableList({
                addItem: function (container, i, property) {
                    var row1 = $('<div/>').appendTo(container);
                    var row2 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
                    var row3 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
                    var row4 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
                    var row5 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
                    var row6 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
                    // this is used to set either flow or global context. Type is flow type and `value` is variable name used in context
                    $('<label/>', { for: "node-input-config-property-type", style: "width:110px; margin-right:10px;" }).text("Property").appendTo(row1);
                    var propertyType = $('<input/>', { style: "width:250px", class: "node-input-config-property-type", type: "text" })
                        .appendTo(row1)
                        .typedInput({ types: ['flow', 'global'] });
                    // all these are just variables that are used to construct kubeconfig. They are mostly strings and not used in context.
                    // TODO: validate those
                    // TODO: Construct kubeconfig in controller before setting to context
                    $('<label/>', { for: "node-input-config-property-incluster", style: "width:110px; margin-right:10px;" }).text("InCluster").appendTo(row2);
                    var propertyInCluster = $('<input/>', { style: "width:250px", class: "node-input-config-property-incluster", type: "checkbox" })
                        .appendTo(row2)
                        .typedInput({ types: ['bool'] });
                    $('<label/>', { for: "node-input-config-property-clustername", style: "width:110px; margin-right:10px;" }).text("Cluster Name").appendTo(row3);
                    var propertyClustername = $('<input/>', { style: "width:250px", class: "node-input-config-property-clustername", type: "text" })
                        .appendTo(row3)
                        .typedInput({ types: ['str'] });
                    $('<label/>', { for: "node-input-config-property-server", style: "width:110px; margin-right:10px;" }).text("Server").appendTo(row4);
                    var propertyServer = $('<input/>', { style: "width:250px", class: "node-input-config-property-server", type: "text" })
                        .appendTo(row4)
                        .typedInput({ types: ['str'] });
                    $('<label/>', { for: "node-input-config-property-user", style: "width:110px; margin-right:10px;" }).text("User").appendTo(row5);
                    var propertyUser = $('<input/>', { style: "width:250px", class: "node-input-config-property-user", type: "text" })
                        .appendTo(row5)
                        .typedInput({ types: ['str'] });
                    $('<label/>', { for: "node-input-config-property-password", style: "width:110px; margin-right:10px;" }).text("Password").appendTo(row6);
                    var propertyPassword = $('<input/>', { style: "width:250px", class: "node-input-config-property-password", type: "text" })
                        .appendTo(row6)
                        .typedInput({ types: ['str'] });
                    propertyType.typedInput('value', property.typeValue);
                    propertyType.typedInput('type', property.type);
                    propertyInCluster.typedInput('value', property.incluster);
                    propertyInCluster.typedInput('type', property.incluster);
                    propertyClustername.typedInput('value', property.clustername);
                    propertyClustername.typedInput('type', property.clustername);
                    propertyServer.typedInput('value', property.server);
                    propertyServer.typedInput('type', property.server);
                    propertyUser.typedInput('value', property.user);
                    propertyUser.typedInput('type', property.user);
                    propertyPassword.typedInput('value', property.password);
                    propertyPassword.typedInput('type', property.password);
                    $("#node-input-config-container").width();
                    resizeConfig(container);
                },
                resizeItem: resizeConfig,
                removable: true,
                sortable: false
            });
            $("#node-input-config-container").editableList('addItems', this.config);
        },
        oneditsave: function () {
            var properties = $("#node-input-config-container").editableList('items');
            var node = this;
            properties.each(function (i) {
                var property = $(this);
                node.config = [];
                var p = {
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
            onclick: function () {
                $.ajax({
                    url: "config/" + this.id,
                    type: "POST",
                    success: function (resp) {
                        RED.notify("Configuration reset", "success");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status == 404) {
                            RED.notify("Node not deployed", "error");
                        }
                        else if (jqXHR.status == 500) {
                            RED.notify("Configuration reset failed", "error");
                        }
                        else if (jqXHR.status == 0) {
                            RED.notify("No response", "error");
                        }
                        else {
                            RED.notify("Unexpected error " + textStatus, "error");
                        }
                    }
                });
            }
        }
    };

    const LowerCaseEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            prefix: { value: "" }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "lower-case";
        }
    };

    const NamespaceEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            cluster: { type: "cluster-config", value: "" },
            name: { value: "" },
            namespacename: { value: "default" }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "namespace";
        }
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("cluster-config-basic", ClusterConfigBasicEditor);
    RED.nodes.registerType("lower-case", LowerCaseEditor);
    RED.nodes.registerType("namespace", NamespaceEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWctYmFzaWMvZWRpdG9yLnRzIiwic3JjL2xvd2VyLWNhc2UvZWRpdG9yLnRzIiwic3JjL25hbWVzcGFjZS9lZGl0b3IudHMiLCJzcmMvZWRpdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RWRpdG9yUkVELCBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCBDbHVzdGVyQ29uZmlnIGZyb20gJy4vdHlwZXMnO1xuXG5kZWNsYXJlIGNvbnN0IFJFRDogRWRpdG9yUkVEO1xuXG5jb25zdCBkZWZhdWx0Q2x1c3RlckNvbmZpZzogQ2x1c3RlckNvbmZpZyA9IHtcbiAgICB0eXBlOiBcImZsb3dcIiwgLy8gVHlwZSBpcyBlaXRoZXIgZmxvdyBvciBnbG9iYWxcbiAgICB0eXBlVmFsdWU6IFwiXCIsIC8vIE5hbWUgaXMgdXNlZCBhcyB0aGUgY29udGV4dCBuYW1lXG5cbiAgICBpbmNsdXN0ZXI6IFwiZmFsc2VcIixcbiAgICBjbHVzdGVybmFtZTogXCJcIixcbiAgICBzZXJ2ZXI6IFwiXCIsXG4gICAgdXNlcjogXCJcIixcbiAgICBwYXNzd29yZDogXCJcIixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbHVzdGVyQ29uZmlnQmFzaWNFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY29uZmlnOiBDbHVzdGVyQ29uZmlnW107XG59XG5cbmNvbnN0IENsdXN0ZXJDb25maWdCYXNpY0VkaXRvcjogRWRpdG9yTm9kZURlZjxDbHVzdGVyQ29uZmlnQmFzaWNFZGl0b3JQcm9wZXJ0aWVzPiA9IHtcbiAgICBjYXRlZ29yeTogJ2Z1bmN0aW9uJyxcbiAgICBjb2xvcjogJyM3QzlBOEMnLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6IHt2YWx1ZTogXCJcIn0sXG4gICAgICAgIGFjdGl2ZToge3ZhbHVlOiB0cnVlfSxcbiAgICAgICAgY29uZmlnOiB7dmFsdWU6IFtkZWZhdWx0Q2x1c3RlckNvbmZpZ119LFxuICAgIH0sXG4gICAgaW5wdXRzOjAsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fFwiY2x1c3Rlci1jb25maWdcIjtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jdGlvbiByZXNpemVDb25maWcoY29uZmlnOiBKUXVlcnk8SFRNTEVsZW1lbnQ+KSB7XG4gICAgICAgICAgICB2YXIgbmV3V2lkdGggPSBjb25maWcud2lkdGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5maW5kKCcucmVkLXVpLXR5cGVkSW5wdXQnKS50eXBlZElucHV0KFwid2lkdGhcIixuZXdXaWR0aC0xNTApO1xuXG4gICAgICAgIH1cbiAgICAgICAgLy8gdmVyeSB2ZXJib3NlIGJ1dCBpdCB3b3JrcyBmb3Igbm93IDpzaHJ1ZzpcbiAgICAgICAgJCgnI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lcicpLmNzcygnbWluLWhlaWdodCcsJzMwMHB4JykuY3NzKCdtaW4td2lkdGgnLCc0NTBweCcpLmVkaXRhYmxlTGlzdCh7XG4gICAgICAgICAgICBhZGRJdGVtOiBmdW5jdGlvbihjb250YWluZXI6IEpRdWVyeTxIVE1MRWxlbWVudD4sIGk6bnVtYmVyLCBwcm9wZXJ0eTogQ2x1c3RlckNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciByb3cxID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93MiA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHZhciByb3czID0gJCgnPGRpdi8+Jyx7c3R5bGU6XCJtYXJnaW4tdG9wOjhweDtcIn0pLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIHJvdzQgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93NSA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHZhciByb3c2ID0gJCgnPGRpdi8+Jyx7c3R5bGU6XCJtYXJnaW4tdG9wOjhweDtcIn0pLmFwcGVuZFRvKGNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHVzZWQgdG8gc2V0IGVpdGhlciBmbG93IG9yIGdsb2JhbCBjb250ZXh0LiBUeXBlIGlzIGZsb3cgdHlwZSBhbmQgYHZhbHVlYCBpcyB2YXJpYWJsZSBuYW1lIHVzZWQgaW4gY29udGV4dFxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktdHlwZVwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIlByb3BlcnR5XCIpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzEpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ2Zsb3cnLCdnbG9iYWwnXX0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZXNlIGFyZSBqdXN0IHZhcmlhYmxlcyB0aGF0IGFyZSB1c2VkIHRvIGNvbnN0cnVjdCBrdWJlY29uZmlnLiBUaGV5IGFyZSBtb3N0bHkgc3RyaW5ncyBhbmQgbm90IHVzZWQgaW4gY29udGV4dC5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB2YWxpZGF0ZSB0aG9zZVxuICAgICAgICAgICAgICAgIC8vIFRPRE86IENvbnN0cnVjdCBrdWJlY29uZmlnIGluIGNvbnRyb2xsZXIgYmVmb3JlIHNldHRpbmcgdG8gY29udGV4dFxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktaW5jbHVzdGVyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiSW5DbHVzdGVyXCIpLmFwcGVuZFRvKHJvdzIpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eUluQ2x1c3RlciA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktaW5jbHVzdGVyXCIsdHlwZTpcImNoZWNrYm94XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93MilcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnYm9vbCddfSk7XG5cbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LWNsdXN0ZXJuYW1lXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQ2x1c3RlciBOYW1lXCIpLmFwcGVuZFRvKHJvdzMpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eUNsdXN0ZXJuYW1lID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1jbHVzdGVybmFtZVwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93MylcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnc3RyJ119KTtcblxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktc2VydmVyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiU2VydmVyXCIpLmFwcGVuZFRvKHJvdzQpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVNlcnZlciA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktc2VydmVyXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3c0KVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG4gICAgICAgICAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS11c2VyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiVXNlclwiKS5hcHBlbmRUbyhyb3c1KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlVc2VyPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXVzZXJcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzUpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ3N0ciddfSk7XG5cbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXBhc3N3b3JkXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiUGFzc3dvcmRcIikuYXBwZW5kVG8ocm93Nik7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5UGFzc3dvcmQgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXBhc3N3b3JkXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3c2KVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG5cblxuICAgICAgICAgICAgICAgIHByb3BlcnR5VHlwZS50eXBlZElucHV0KCd2YWx1ZScsIHByb3BlcnR5LnR5cGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlUeXBlLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnR5cGUpO1xuXG4gICAgICAgICAgICAgICAgcHJvcGVydHlJbkNsdXN0ZXIudHlwZWRJbnB1dCgndmFsdWUnLHByb3BlcnR5LmluY2x1c3Rlcik7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlJbkNsdXN0ZXIudHlwZWRJbnB1dCgndHlwZScscHJvcGVydHkuaW5jbHVzdGVyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUNsdXN0ZXJuYW1lLnR5cGVkSW5wdXQoJ3ZhbHVlJyxwcm9wZXJ0eS5jbHVzdGVybmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlDbHVzdGVybmFtZS50eXBlZElucHV0KCd0eXBlJyxwcm9wZXJ0eS5jbHVzdGVybmFtZSk7XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVNlcnZlci50eXBlZElucHV0KCd2YWx1ZScscHJvcGVydHkuc2VydmVyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVNlcnZlci50eXBlZElucHV0KCd0eXBlJyxwcm9wZXJ0eS5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5VXNlci50eXBlZElucHV0KCd2YWx1ZScscHJvcGVydHkudXNlcik7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlVc2VyLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnVzZXIpO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5UGFzc3dvcmQudHlwZWRJbnB1dCgndmFsdWUnLHByb3BlcnR5LnBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVBhc3N3b3JkLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnBhc3N3b3JkKTtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9ICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgcmVzaXplQ29uZmlnKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzaXplSXRlbTogcmVzaXplQ29uZmlnLFxuICAgICAgICAgICAgcmVtb3ZhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpLmVkaXRhYmxlTGlzdCgnYWRkSXRlbXMnLCB0aGlzLmNvbmZpZyk7XG4gICAgfSxcbiAgICBvbmVkaXRzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKS5lZGl0YWJsZUxpc3QoJ2l0ZW1zJyk7XG4gICAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgICAgcHJvcGVydGllcy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9ICQodGhpcyk7XG4gICAgICAgICAgICBub2RlLmNvbmZpZyA9IFtdXG4gICAgICAgICAgICB2YXIgcDogQ2x1c3RlckNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIikudHlwZWRJbnB1dCgndHlwZScpLFxuICAgICAgICAgICAgICAgIHR5cGVWYWx1ZTogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS10eXBlXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyksXG5cbiAgICAgICAgICAgICAgICBpbmNsdXN0ZXI6IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktaW5jbHVzdGVyXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyksXG4gICAgICAgICAgICAgICAgY2x1c3Rlcm5hbWU6IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktY2x1c3Rlcm5hbWVcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXI6IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktc2VydmVyXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyksXG4gICAgICAgICAgICAgICAgdXNlcjogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS11c2VyXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktcGFzc3dvcmRcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBub2RlLmNvbmZpZy5wdXNoKHApO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGJ1dHRvbjoge1xuICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcImNvbmZpZy9cIit0aGlzLmlkLFxuICAgICAgICAgICAgICAgIHR5cGU6XCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgICAgICAgICAgICBSRUQubm90aWZ5KFwiQ29uZmlndXJhdGlvbiByZXNldFwiLFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUix0ZXh0U3RhdHVzLGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqcVhIUi5zdGF0dXMgPT0gNDA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSRUQubm90aWZ5KFwiTm9kZSBub3QgZGVwbG95ZWRcIixcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGpxWEhSLnN0YXR1cyA9PSA1MDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJDb25maWd1cmF0aW9uIHJlc2V0IGZhaWxlZFwiLFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoanFYSFIuc3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJObyByZXNwb25zZVwiLFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSRUQubm90aWZ5KFwiVW5leHBlY3RlZCBlcnJvciBcIiArIHRleHRTdGF0dXMsXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnQmFzaWNFZGl0b3I7XG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcblxuZXhwb3J0IGludGVyZmFjZSBMb3dlckNhc2VFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIHByZWZpeDogc3RyaW5nO1xufVxuXG5jb25zdCBMb3dlckNhc2VFZGl0b3I6IEVkaXRvck5vZGVEZWY8TG93ZXJDYXNlRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjYTZiYmNmJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6XCJcIn0sXG4gICAgICAgIHByZWZpeDoge3ZhbHVlOiBcIlwifVxuICAgIH0sXG4gICAgaW5wdXRzOjEsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fFwibG93ZXItY2FzZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG93ZXJDYXNlRWRpdG9yO1xuIiwiaW1wb3J0IHsgRWRpdG9yTm9kZURlZiwgRWRpdG9yTm9kZVByb3BlcnRpZXMgfSBmcm9tICdub2RlLXJlZCc7XG5pbXBvcnQgeyBDbHVzdGVyQ29uZmlnUHJvcGVydGllcyB9IGZyb20gJy4uL2NsdXN0ZXItY29uZmlnL2NvbnRyb2xsZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVzcGFjZUVkaXRvclByb3BlcnRpZXMgZXh0ZW5kcyBFZGl0b3JOb2RlUHJvcGVydGllcyB7XG4gICAgbmFtZXNwYWNlbmFtZTogc3RyaW5nO1xuICAgIGNsdXN0ZXI6IENsdXN0ZXJDb25maWdQcm9wZXJ0aWVzO1xufVxuXG5jb25zdCBOYW1lc3BhY2VFZGl0b3I6IEVkaXRvck5vZGVEZWY8TmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjYTZiYmNmJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBjbHVzdGVyOiB7dHlwZTogXCJjbHVzdGVyLWNvbmZpZ1wiLCB2YWx1ZTogXCJcIn0sXG4gICAgICAgIG5hbWU6IHt2YWx1ZTpcIlwifSxcbiAgICAgICAgbmFtZXNwYWNlbmFtZToge3ZhbHVlOiBcImRlZmF1bHRcIn1cbiAgICB9LFxuICAgIGlucHV0czoxLFxuICAgIG91dHB1dHM6MSxcbiAgICBpY29uOiBcImZpbGUucG5nXCIsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxcIm5hbWVzcGFjZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlRWRpdG9yO1xuIiwiaW1wb3J0IHsgRWRpdG9yUkVEIH0gZnJvbSBcIm5vZGUtcmVkXCI7XG5pbXBvcnQgQ2x1c3RlckVkaXRvckJhc2ljIGZyb20gXCIuL2NsdXN0ZXItY29uZmlnLWJhc2ljL2VkaXRvclwiO1xuaW1wb3J0IExvd2VyQ2FzZUVkaXRvciBmcm9tIFwiLi9sb3dlci1jYXNlL2VkaXRvclwiO1xuaW1wb3J0IE5hbWVzcGFjZUVkaXRvciBmcm9tIFwiLi9uYW1lc3BhY2UvZWRpdG9yXCI7XG5cbmRlY2xhcmUgY29uc3QgUkVEOiBFZGl0b3JSRUQ7XG5cbi8vIGZldGNoIGRpc2NvdmVyZWQgdHlwZXMgZnJvbSB0aGUgYmFja2VuZCxcbi8vIGFuZCBmb3IgZWFjaCB0eXBlLCByZWdpc3RlciBhIGt1YmUgbm9kZSAoaS5lLiBkZXBsb3ltZW50LCBub2RlcywgcG9kcywgZXRjLiBldGMuIGluY2x1ZGluZyBDUkRzKVxuLy8gaW4gbm9kZS1yZWRcblxuLy8gZm9yIHR5cGUgOj0gcmFuZ2UgZGlzY292ZXJlZFR5cGVzIHtcbi8vICAgICBSRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwicG9kc1wiLCBQb2RzRWRpdG9yKTtcbi8vIH1cblxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcImNsdXN0ZXItY29uZmlnLWJhc2ljXCIsIENsdXN0ZXJFZGl0b3JCYXNpYyk7XG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwibG93ZXItY2FzZVwiLCBMb3dlckNhc2VFZGl0b3IpO1xuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcIm5hbWVzcGFjZVwiLCBOYW1lc3BhY2VFZGl0b3IpO1xuIl0sIm5hbWVzIjpbIkNsdXN0ZXJFZGl0b3JCYXNpYyJdLCJtYXBwaW5ncyI6Ijs7O0lBS0EsTUFBTSxvQkFBb0IsR0FBa0I7SUFDeEMsSUFBQSxJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUEsU0FBUyxFQUFFLEVBQUU7SUFFYixJQUFBLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLElBQUEsV0FBVyxFQUFFLEVBQUU7SUFDZixJQUFBLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBQSxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUEsUUFBUSxFQUFFLEVBQUU7S0FDZixDQUFBO0lBUUQsTUFBTSx3QkFBd0IsR0FBc0Q7SUFDaEYsSUFBQSxRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFBLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUEsUUFBUSxFQUFFO0lBQ04sUUFBQSxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDO0lBQ2pCLFFBQUEsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQztJQUNyQixRQUFBLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUM7SUFDMUMsS0FBQTtJQUNELElBQUEsTUFBTSxFQUFDLENBQUM7SUFDUixJQUFBLE9BQU8sRUFBQyxDQUFDO0lBQ1QsSUFBQSxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFBLEtBQUssRUFBRSxZQUFBO0lBQ0gsUUFBQSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUUsZ0JBQWdCLENBQUM7U0FDdEM7SUFDRCxJQUFBLGFBQWEsRUFBRSxZQUFBO1lBQ1gsU0FBUyxZQUFZLENBQUMsTUFBMkIsRUFBQTtJQUM3QyxZQUFBLElBQUksUUFB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