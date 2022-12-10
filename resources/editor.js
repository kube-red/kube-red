(function () {
    'use strict';

    const Controller$1 = {
        name: "cluster-config",
    };

    const defaultClusterConfig = {
        sourcetype: "flow",
        sourceclustername: "",
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
            return this.name || Controller$1.name;
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
                    var propertyClusterName = $('<input/>', { style: "width:250px", class: "node-input-config-property-clustername", type: "text" })
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
                    propertyType.typedInput('value', property.sourceclustername);
                    propertyType.typedInput('type', property.sourcetype);
                    propertyInCluster.typedInput('value', property.incluster);
                    propertyInCluster.typedInput('type', property.incluster);
                    propertyClusterName.typedInput('value', property.clustername);
                    propertyClusterName.typedInput('type', property.clustername);
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
                    sourcetype: property.find(".node-input-config-property-type").typedInput('type'),
                    sourceclustername: property.find(".node-input-config-property-type").typedInput('value'),
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

    const Controller = {
        name: "create-namespace",
    };

    const defaultNamespaceConfig = {
        sourceType: "flow",
        sourceClusterName: "", // Name is used as the context name
    };
    const NamespaceEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            active: { value: true },
            config: { value: defaultNamespaceConfig },
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || Controller.name;
        },
        oneditprepare: function () {
            // Cluster config container
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-cluster-name-property-type", style: "width:110px; margin-right:10px;" }).text("Name").appendTo(row1);
            var propertyType = $('<input/>', { style: "width:250px", class: "node-input-cluster-name-property-type", type: "text" })
                .appendTo(row1)
                .typedInput({ types: ['flow', 'global'] });
            propertyType.typedInput('type', this.config.sourceType);
            propertyType.typedInput('value', this.config.sourceClusterName);
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.config.sourceType = property.find(".node-input-cluster-name-property-type").typedInput('type');
            node.config.sourceClusterName = property.find(".node-input-cluster-name-property-type").typedInput('value');
        },
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType(Controller$1.name, ClusterConfigBasicEditor);
    RED.nodes.registerType(Controller.name, NamespaceEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL2NyZWF0ZS1uYW1lc3BhY2UvdHlwZXMudHMiLCJzcmMvY3JlYXRlLW5hbWVzcGFjZS9lZGl0b3IudHMiLCJzcmMvZWRpdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckNvbmZpZyB7XG4gICAgc291cmNldHlwZTogc3RyaW5nO1xuICAgIHNvdXJjZWNsdXN0ZXJuYW1lOiBzdHJpbmc7XG4gICAgaW5jbHVzdGVyOiBzdHJpbmc7XG4gICAgY2x1c3Rlcm5hbWU6IHN0cmluZztcbiAgICBzZXJ2ZXI6IHN0cmluZztcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IENvbnRyb2xsZXIgPSB7XG4gICAgbmFtZTogXCJjbHVzdGVyLWNvbmZpZ1wiLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ2x1c3RlckNvbmZpZztcbiIsImltcG9ydCB7RWRpdG9yUkVELCBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7Q2x1c3RlckNvbmZpZywgQ29udHJvbGxlcn0gZnJvbSAnLi90eXBlcyc7XG5cbmRlY2xhcmUgY29uc3QgUkVEOiBFZGl0b3JSRUQ7XG5cbmNvbnN0IGRlZmF1bHRDbHVzdGVyQ29uZmlnOiBDbHVzdGVyQ29uZmlnID0ge1xuICAgIHNvdXJjZXR5cGU6IFwiZmxvd1wiLCAvLyBUeXBlIGlzIGVpdGhlciBmbG93IG9yIGdsb2JhbFxuICAgIHNvdXJjZWNsdXN0ZXJuYW1lOiBcIlwiLCAvLyBOYW1lIGlzIHVzZWQgYXMgdGhlIGNvbnRleHQgbmFtZVxuXG4gICAgaW5jbHVzdGVyOiBcImZhbHNlXCIsXG4gICAgY2x1c3Rlcm5hbWU6IFwiXCIsXG4gICAgc2VydmVyOiBcIlwiLFxuICAgIHVzZXI6IFwiXCIsXG4gICAgcGFzc3dvcmQ6IFwiXCIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckNvbmZpZ0Jhc2ljRWRpdG9yUHJvcGVydGllcyBleHRlbmRzIEVkaXRvck5vZGVQcm9wZXJ0aWVzIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZ1tdO1xufVxuXG5jb25zdCBDbHVzdGVyQ29uZmlnQmFzaWNFZGl0b3I6IEVkaXRvck5vZGVEZWY8Q2x1c3RlckNvbmZpZ0Jhc2ljRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjN0M5QThDJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6IFwiXCJ9LFxuICAgICAgICBhY3RpdmU6IHt2YWx1ZTogdHJ1ZX0sXG4gICAgICAgIGNvbmZpZzoge3ZhbHVlOiBbZGVmYXVsdENsdXN0ZXJDb25maWddfSxcbiAgICB9LFxuICAgIGlucHV0czowLFxuICAgIG91dHB1dHM6MSxcbiAgICBpY29uOiBcImZpbGUucG5nXCIsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxDb250cm9sbGVyLm5hbWU7XG4gICAgfSxcbiAgICBvbmVkaXRwcmVwYXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gcmVzaXplQ29uZmlnKGNvbmZpZzogSlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgICAgICAgICAgdmFyIG5ld1dpZHRoID0gY29uZmlnLndpZHRoKCk7XG4gICAgICAgICAgICBjb25maWcuZmluZCgnLnJlZC11aS10eXBlZElucHV0JykudHlwZWRJbnB1dChcIndpZHRoXCIsbmV3V2lkdGgtMTUwKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vIHZlcnkgdmVyYm9zZSBidXQgaXQgd29ya3MgZm9yIG5vdyA6c2hydWc6XG4gICAgICAgICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKS5jc3MoJ21pbi1oZWlnaHQnLCczMDBweCcpLmNzcygnbWluLXdpZHRoJywnNDUwcHgnKS5lZGl0YWJsZUxpc3Qoe1xuICAgICAgICAgICAgYWRkSXRlbTogZnVuY3Rpb24oY29udGFpbmVyOiBKUXVlcnk8SFRNTEVsZW1lbnQ+LCBpOm51bWJlciwgcHJvcGVydHk6IENsdXN0ZXJDb25maWcpIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIHJvdzIgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93MyA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHZhciByb3c0ID0gJCgnPGRpdi8+Jyx7c3R5bGU6XCJtYXJnaW4tdG9wOjhweDtcIn0pLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIHJvdzUgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93NiA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VkIHRvIHNldCBlaXRoZXIgZmxvdyBvciBnbG9iYWwgY29udGV4dC4gVHlwZSBpcyBmbG93IHR5cGUgYW5kIGB2YWx1ZWAgaXMgdmFyaWFibGUgbmFtZSB1c2VkIGluIGNvbnRleHRcbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJQcm9wZXJ0eVwiKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlUeXBlID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS10eXBlXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydmbG93JywnZ2xvYmFsJ119KTtcblxuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGVzZSBhcmUganVzdCB2YXJpYWJsZXMgdGhhdCBhcmUgdXNlZCB0byBjb25zdHJ1Y3Qga3ViZWNvbmZpZy4gVGhleSBhcmUgbW9zdGx5IHN0cmluZ3MgYW5kIG5vdCB1c2VkIGluIGNvbnRleHQuXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogdmFsaWRhdGUgdGhvc2VcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBDb25zdHJ1Y3Qga3ViZWNvbmZpZyBpbiBjb250cm9sbGVyIGJlZm9yZSBzZXR0aW5nIHRvIGNvbnRleHRcbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LWluY2x1c3RlclwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIkluQ2x1c3RlclwiKS5hcHBlbmRUbyhyb3cyKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlJbkNsdXN0ZXIgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LWluY2x1c3RlclwiLHR5cGU6XCJjaGVja2JveFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzIpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ2Jvb2wnXX0pO1xuXG4gICAgICAgICAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1jbHVzdGVybmFtZVwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIkNsdXN0ZXIgTmFtZVwiKS5hcHBlbmRUbyhyb3czKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlDbHVzdGVyTmFtZSA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktY2x1c3Rlcm5hbWVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzMpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ3N0ciddfSk7XG5cbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXNlcnZlclwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIlNlcnZlclwiKS5hcHBlbmRUbyhyb3c0KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlTZXJ2ZXIgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXNlcnZlclwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93NClcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnc3RyJ119KTtcblxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktdXNlclwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIlVzZXJcIikuYXBwZW5kVG8ocm93NSk7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VXNlcj0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS11c2VyXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3c1KVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG4gICAgICAgICAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1wYXNzd29yZFwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIlBhc3N3b3JkXCIpLmFwcGVuZFRvKHJvdzYpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVBhc3N3b3JkID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1wYXNzd29yZFwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93NilcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnc3RyJ119KTtcblxuXG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUudHlwZWRJbnB1dCgndmFsdWUnLCBwcm9wZXJ0eS5zb3VyY2VjbHVzdGVybmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlUeXBlLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnNvdXJjZXR5cGUpO1xuXG4gICAgICAgICAgICAgICAgcHJvcGVydHlJbkNsdXN0ZXIudHlwZWRJbnB1dCgndmFsdWUnLHByb3BlcnR5LmluY2x1c3Rlcik7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlJbkNsdXN0ZXIudHlwZWRJbnB1dCgndHlwZScscHJvcGVydHkuaW5jbHVzdGVyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUNsdXN0ZXJOYW1lLnR5cGVkSW5wdXQoJ3ZhbHVlJyxwcm9wZXJ0eS5jbHVzdGVybmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlDbHVzdGVyTmFtZS50eXBlZElucHV0KCd0eXBlJyxwcm9wZXJ0eS5jbHVzdGVybmFtZSk7XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVNlcnZlci50eXBlZElucHV0KCd2YWx1ZScscHJvcGVydHkuc2VydmVyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVNlcnZlci50eXBlZElucHV0KCd0eXBlJyxwcm9wZXJ0eS5zZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5VXNlci50eXBlZElucHV0KCd2YWx1ZScscHJvcGVydHkudXNlcik7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlVc2VyLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnVzZXIpO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5UGFzc3dvcmQudHlwZWRJbnB1dCgndmFsdWUnLHByb3BlcnR5LnBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVBhc3N3b3JkLnR5cGVkSW5wdXQoJ3R5cGUnLHByb3BlcnR5LnBhc3N3b3JkKTtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdXaWR0aCA9ICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgcmVzaXplQ29uZmlnKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzaXplSXRlbTogcmVzaXplQ29uZmlnLFxuICAgICAgICAgICAgcmVtb3ZhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpLmVkaXRhYmxlTGlzdCgnYWRkSXRlbXMnLCB0aGlzLmNvbmZpZyk7XG4gICAgfSxcbiAgICBvbmVkaXRzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKS5lZGl0YWJsZUxpc3QoJ2l0ZW1zJyk7XG4gICAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgICAgcHJvcGVydGllcy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9ICQodGhpcyk7XG4gICAgICAgICAgICBub2RlLmNvbmZpZyA9IFtdXG4gICAgICAgICAgICB2YXIgcDogQ2x1c3RlckNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBzb3VyY2V0eXBlOiBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIikudHlwZWRJbnB1dCgndHlwZScpLFxuICAgICAgICAgICAgICAgIHNvdXJjZWNsdXN0ZXJuYW1lOiBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcblxuICAgICAgICAgICAgICAgIGluY2x1c3RlcjogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1pbmNsdXN0ZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICBjbHVzdGVybmFtZTogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1jbHVzdGVybmFtZVwiKS50eXBlZElucHV0KCd2YWx1ZScpLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1zZXJ2ZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICB1c2VyOiBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXVzZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1wYXNzd29yZFwiKS50eXBlZElucHV0KCd2YWx1ZScpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5vZGUuY29uZmlnLnB1c2gocCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiY29uZmlnL1wiK3RoaXMuaWQsXG4gICAgICAgICAgICAgICAgdHlwZTpcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJDb25maWd1cmF0aW9uIHJlc2V0XCIsXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpxWEhSLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJOb2RlIG5vdCBkZXBsb3llZFwiLFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoanFYSFIuc3RhdHVzID09IDUwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUkVELm5vdGlmeShcIkNvbmZpZ3VyYXRpb24gcmVzZXQgZmFpbGVkXCIsXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqcVhIUi5zdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUkVELm5vdGlmeShcIk5vIHJlc3BvbnNlXCIsXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJVbmV4cGVjdGVkIGVycm9yIFwiICsgdGV4dFN0YXR1cyxcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdCYXNpY0VkaXRvcjtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlQ29uZmlnIHtcbiAgICBzb3VyY2VUeXBlOiBzdHJpbmc7XG4gICAgc291cmNlQ2x1c3Rlck5hbWU6IHN0cmluZztcbn1cblxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNyZWF0ZS1uYW1lc3BhY2VcIixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVzcGFjZUNvbmZpZztcblxuIiwiaW1wb3J0IHsgRWRpdG9yTm9kZURlZiwgRWRpdG9yTm9kZVByb3BlcnRpZXMgfSBmcm9tICdub2RlLXJlZCc7XG5pbXBvcnQge05hbWVzcGFjZUNvbmZpZywgQ29udHJvbGxlcn0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcyBleHRlbmRzIEVkaXRvck5vZGVQcm9wZXJ0aWVzIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNvbmZpZzogTmFtZXNwYWNlQ29uZmlnO1xufVxuXG5jb25zdCBkZWZhdWx0TmFtZXNwYWNlQ29uZmlnOiBOYW1lc3BhY2VDb25maWcgPSB7XG4gICAgc291cmNlVHlwZTogXCJmbG93XCIsIC8vIFR5cGUgaXMgZWl0aGVyIGZsb3cgb3IgZ2xvYmFsXG4gICAgc291cmNlQ2x1c3Rlck5hbWU6IFwiXCIsIC8vIE5hbWUgaXMgdXNlZCBhcyB0aGUgY29udGV4dCBuYW1lXG59XG5cblxuY29uc3QgTmFtZXNwYWNlRWRpdG9yOiBFZGl0b3JOb2RlRGVmPE5hbWVzcGFjZUVkaXRvclByb3BlcnRpZXM+ID0ge1xuICAgIGNhdGVnb3J5OiAnZnVuY3Rpb24nLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBhY3RpdmU6IHt2YWx1ZTp0cnVlfSxcbiAgICAgICAgY29uZmlnOiB7dmFsdWU6IGRlZmF1bHROYW1lc3BhY2VDb25maWd9LFxuICAgIH0sXG4gICAgaW5wdXRzOjEsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDbHVzdGVyIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKVxuICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jbHVzdGVyLW5hbWUtcHJvcGVydHktdHlwZVwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIk5hbWVcIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY2x1c3Rlci1uYW1lLXByb3BlcnR5LXR5cGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZmxvdycsJ2dsb2JhbCddfSk7XG5cbiAgICAgICAgcHJvcGVydHlUeXBlLnR5cGVkSW5wdXQoJ3R5cGUnLHRoaXMuY29uZmlnLnNvdXJjZVR5cGUpO1xuICAgICAgICBwcm9wZXJ0eVR5cGUudHlwZWRJbnB1dCgndmFsdWUnLHRoaXMuY29uZmlnLnNvdXJjZUNsdXN0ZXJOYW1lKTtcbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmNvbmZpZy5zb3VyY2VUeXBlID0gcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNsdXN0ZXItbmFtZS1wcm9wZXJ0eS10eXBlXCIpLnR5cGVkSW5wdXQoJ3R5cGUnKTtcbiAgICAgICAgbm9kZS5jb25maWcuc291cmNlQ2x1c3Rlck5hbWUgPSBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY2x1c3Rlci1uYW1lLXByb3BlcnR5LXR5cGVcIikudHlwZWRJbnB1dCgndmFsdWUnKTtcbiAgICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBOYW1lc3BhY2VFZGl0b3I7XG4iLCJpbXBvcnQgeyBFZGl0b3JSRUQgfSBmcm9tIFwibm9kZS1yZWRcIjtcbmltcG9ydCBDbHVzdGVyRWRpdG9yQmFzaWMgZnJvbSBcIi4vY2x1c3Rlci1jb25maWcvZWRpdG9yXCI7XG5pbXBvcnQgTmFtZXNwYWNlRWRpdG9yIGZyb20gXCIuL2NyZWF0ZS1uYW1lc3BhY2UvZWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBOYW1lc3BhY2VDcmVhdGUgZnJvbSBcIi4vY3JlYXRlLW5hbWVzcGFjZS90eXBlc1wiO1xuaW1wb3J0ICogYXMgQ2x1c3RlckNvbmZpZyBmcm9tIFwiLi9jbHVzdGVyLWNvbmZpZy90eXBlc1wiO1xuXG5cbmRlY2xhcmUgY29uc3QgUkVEOiBFZGl0b3JSRUQ7XG5cbi8vIGZldGNoIGRpc2NvdmVyZWQgdHlwZXMgZnJvbSB0aGUgYmFja2VuZCxcbi8vIGFuZCBmb3IgZWFjaCB0eXBlLCByZWdpc3RlciBhIGt1YmUgbm9kZSAoaS5lLiBkZXBsb3ltZW50LCBub2RlcywgcG9kcywgZXRjLiBldGMuIGluY2x1ZGluZyBDUkRzKVxuLy8gaW4gbm9kZS1yZWRcblxuLy8gZm9yIHR5cGUgOj0gcmFuZ2UgZGlzY292ZXJlZFR5cGVzIHtcbi8vICAgICBSRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwicG9kc1wiLCBQb2RzRWRpdG9yKTtcbi8vIH1cblxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShDbHVzdGVyQ29uZmlnLkNvbnRyb2xsZXIubmFtZSwgQ2x1c3RlckVkaXRvckJhc2ljKTtcblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoTmFtZXNwYWNlQ3JlYXRlLkNvbnRyb2xsZXIubmFtZSwgTmFtZXNwYWNlRWRpdG9yKTtcbiJdLCJuYW1lcyI6WyJDb250cm9sbGVyIiwiQ2x1c3RlckNvbmZpZy5Db250cm9sbGVyIiwiQ2x1c3RlckVkaXRvckJhc2ljIiwiTmFtZXNwYWNlQ3JlYXRlLkNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7OztJQVVPLE1BQU1BLFlBQVUsR0FBRztJQUN0QixJQUFBLElBQUksRUFBRSxnQkFBZ0I7S0FDekI7O0lDUEQsTUFBTSxvQkFBb0IsR0FBa0I7SUFDeEMsSUFBQSxVQUFVLEVBQUUsTUFBTTtJQUNsQixJQUFBLGlCQUFpQixFQUFFLEVBQUU7SUFFckIsSUFBQSxTQUFTLEVBQUUsT0FBTztJQUNsQixJQUFBLFdBQVcsRUFBRSxFQUFFO0lBQ2YsSUFBQSxNQUFN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