(function () {
    'use strict';

    const Controller$3 = {
        name: "cluster-config",
    };

    const defaultClusterConfig = {
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
            return this.name || Controller$3.name;
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
                    $('<label/>', { for: "node-input-config-property-type", style: "width:110px; margin-right:10px;" }).text("Variable").appendTo(row1);
                    var propertyType = $('<input/>', { style: "width:250px", class: "node-input-config-property-type", type: "text" })
                        .appendTo(row1)
                        .typedInput({ types: ['global'] });
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
                    propertyInCluster.typedInput('value', property.incluster);
                    propertyClusterName.typedInput('value', property.clustername);
                    propertyServer.typedInput('value', property.server);
                    propertyUser.typedInput('value', property.user);
                    propertyPassword.typedInput('value', property.password);
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

    const Controller$2 = {
        name: "create-namespace",
    };

    const defaultNamespaceConfig$2 = {
        sourceClusterName: "", // Name is used as the context name
    };
    const NamespaceEditor$2 = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            active: { value: true },
            config: { value: defaultNamespaceConfig$2 },
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || Controller$2.name;
        },
        oneditprepare: function () {
            // Cluster config container
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-cluster-name-property-type", style: "width:110px; margin-right:10px;" }).text("Name").appendTo(row1);
            var propertyType = $('<input/>', { style: "width:250px", class: "node-input-cluster-name-property-type", type: "text" })
                .appendTo(row1)
                .typedInput({ types: ['global'] });
            propertyType.typedInput('value', this.config.sourceClusterName);
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.config.sourceClusterName = property.find(".node-input-cluster-name-property-type").typedInput('value');
        },
    };

    const Controller$1 = {
        name: "list-namespaces",
    };

    const defaultNamespaceConfig$1 = {
        sourceClusterName: "", // Name is used as the context name
    };
    const NamespaceEditor$1 = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            active: { value: true },
            config: { value: defaultNamespaceConfig$1 },
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || Controller$1.name;
        },
        oneditprepare: function () {
            // Cluster config container
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-cluster-name-property-type", style: "width:110px; margin-right:10px;" }).text("Name").appendTo(row1);
            var propertyType = $('<input/>', { style: "width:250px", class: "node-input-cluster-name-property-type", type: "text" })
                .appendTo(row1)
                .typedInput({ types: ['global'] });
            propertyType.typedInput('value', this.config.sourceClusterName);
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.config.sourceClusterName = property.find(".node-input-cluster-name-property-type").typedInput('value');
        },
    };

    const Controller = {
        name: "namespace",
    };

    const defaultNamespaceConfig = {
        sourceClusterName: "kubeconfig",
        action: "create",
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
            function selectAction(ev) {
                var t = ev.target; // convert to basic element
                var container = $('#node-input-action-configuration');
                container.empty();
                var row1 = $('<div/>').appendTo(container);
                switch (t.value) {
                    case "create":
                        $('<label/>', { for: "node-input-create", style: "width:110px; margin-right:10px;" }).text("Create").appendTo(row1);
                        $('<input/>', { style: "width:250px", class: "node-input-create", type: "text" })
                            .appendTo(row1)
                            .typedInput({ types: ['global'] });
                    case "delete":
                        $('<label/>', { for: "node-input-delete", style: "width:110px; margin-right:10px;" }).text("Delete").appendTo(row1);
                        $('<input/>', { style: "width:250px", class: "node-input-delete", type: "text" })
                            .appendTo(row1)
                            .typedInput({ types: ['str'] });
                }
            }
            // Cluster config container
            // TODO: This will be shared for all nodes/resources. We should move it to a shared file
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-cluster-name", style: "width:110px; margin-right:10px;" }).text("Cluster").appendTo(row1);
            var propertyType = $('<input/>', { style: "width:250px", class: "node-input-cluster-name", type: "text" })
                .appendTo(row1)
                .typedInput({ types: ['global'] });
            var row2 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-action", style: "width:110px; margin-right:10px;" }).text("Action").appendTo(row2);
            var propertyAction = $('<select/>', { style: "width:250px", class: "node-input-action",
                // Add event listener to render the correct fields
                onchange: function (ev) {
                    addEventListener('change', selectAction);
                } })
                .appendTo(row2);
            var actions = ["create", "delete", "list", "get", "apply", "watch"];
            actions.forEach(action => {
                propertyAction.append($('<option>', {
                    value: action,
                    text: action,
                })).appendTo(row2);
            });
            propertyType.typedInput('value', this.config.sourceClusterName);
            propertyAction.val(this.config.action);
            // TODO: Preload the correct fields based on the action
            //var action = $("#node-input-action-configuration");
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.config.sourceClusterName = property.find(".node-input-cluster-name").typedInput('value');
            node.config.action = property.find(".node-input-action :selected").text();
        },
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType(Controller$3.name, ClusterConfigBasicEditor);
    RED.nodes.registerType(Controller$2.name, NamespaceEditor$2);
    RED.nodes.registerType(Controller$1.name, NamespaceEditor$1);
    RED.nodes.registerType(Controller.name, NamespaceEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL2NyZWF0ZS1uYW1lc3BhY2UvdHlwZXMudHMiLCJzcmMvY3JlYXRlLW5hbWVzcGFjZS9lZGl0b3IudHMiLCJzcmMvbGlzdC1uYW1lc3BhY2VzL3R5cGVzLnRzIiwic3JjL2xpc3QtbmFtZXNwYWNlcy9lZGl0b3IudHMiLCJzcmMvbmFtZXNwYWNlL3R5cGVzLnRzIiwic3JjL25hbWVzcGFjZS9lZGl0b3IudHMiLCJzcmMvZWRpdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckNvbmZpZyB7XG4gICAgc291cmNlY2x1c3Rlcm5hbWU6IHN0cmluZztcbiAgICBpbmNsdXN0ZXI6IHN0cmluZztcbiAgICBjbHVzdGVybmFtZTogc3RyaW5nO1xuICAgIHNlcnZlcjogc3RyaW5nO1xuICAgIHVzZXI6IHN0cmluZztcbiAgICBwYXNzd29yZDogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNsdXN0ZXItY29uZmlnXCIsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnO1xuIiwiaW1wb3J0IHtFZGl0b3JSRUQsIEVkaXRvck5vZGVEZWYsIEVkaXRvck5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnbm9kZS1yZWQnO1xuaW1wb3J0IHtDbHVzdGVyQ29uZmlnLCBDb250cm9sbGVyfSBmcm9tICcuL3R5cGVzJztcblxuZGVjbGFyZSBjb25zdCBSRUQ6IEVkaXRvclJFRDtcblxuY29uc3QgZGVmYXVsdENsdXN0ZXJDb25maWc6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgc291cmNlY2x1c3Rlcm5hbWU6IFwiXCIsIC8vIE5hbWUgaXMgdXNlZCBhcyB0aGUgY29udGV4dCBuYW1lXG4gICAgaW5jbHVzdGVyOiBcImZhbHNlXCIsXG4gICAgY2x1c3Rlcm5hbWU6IFwiXCIsXG4gICAgc2VydmVyOiBcIlwiLFxuICAgIHVzZXI6IFwiXCIsXG4gICAgcGFzc3dvcmQ6IFwiXCIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckNvbmZpZ0Jhc2ljRWRpdG9yUHJvcGVydGllcyBleHRlbmRzIEVkaXRvck5vZGVQcm9wZXJ0aWVzIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZ1tdO1xufVxuXG5jb25zdCBDbHVzdGVyQ29uZmlnQmFzaWNFZGl0b3I6IEVkaXRvck5vZGVEZWY8Q2x1c3RlckNvbmZpZ0Jhc2ljRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjN0M5QThDJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6IFwiXCJ9LFxuICAgICAgICBhY3RpdmU6IHt2YWx1ZTogdHJ1ZX0sXG4gICAgICAgIGNvbmZpZzoge3ZhbHVlOiBbZGVmYXVsdENsdXN0ZXJDb25maWddfSxcbiAgICB9LFxuICAgIGlucHV0czowLFxuICAgIG91dHB1dHM6MSxcbiAgICBpY29uOiBcImZpbGUucG5nXCIsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxDb250cm9sbGVyLm5hbWU7XG4gICAgfSxcbiAgICBvbmVkaXRwcmVwYXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gcmVzaXplQ29uZmlnKGNvbmZpZzogSlF1ZXJ5PEhUTUxFbGVtZW50Pikge1xuICAgICAgICAgICAgdmFyIG5ld1dpZHRoID0gY29uZmlnLndpZHRoKCk7XG4gICAgICAgICAgICBjb25maWcuZmluZCgnLnJlZC11aS10eXBlZElucHV0JykudHlwZWRJbnB1dChcIndpZHRoXCIsbmV3V2lkdGgtMTUwKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vIHZlcnkgdmVyYm9zZSBidXQgaXQgd29ya3MgZm9yIG5vdyA6c2hydWc6XG4gICAgICAgICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKS5jc3MoJ21pbi1oZWlnaHQnLCczMDBweCcpLmNzcygnbWluLXdpZHRoJywnNDUwcHgnKS5lZGl0YWJsZUxpc3Qoe1xuICAgICAgICAgICAgYWRkSXRlbTogZnVuY3Rpb24oY29udGFpbmVyOiBKUXVlcnk8SFRNTEVsZW1lbnQ+LCBpOm51bWJlciwgcHJvcGVydHk6IENsdXN0ZXJDb25maWcpIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIHJvdzIgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93MyA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHZhciByb3c0ID0gJCgnPGRpdi8+Jyx7c3R5bGU6XCJtYXJnaW4tdG9wOjhweDtcIn0pLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgdmFyIHJvdzUgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93NiA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VkIHRvIHNldCBlaXRoZXIgZmxvdyBvciBnbG9iYWwgY29udGV4dC4gVHlwZSBpcyBmbG93IHR5cGUgYW5kIGB2YWx1ZWAgaXMgdmFyaWFibGUgbmFtZSB1c2VkIGluIGNvbnRleHRcbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXR5cGVcIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJWYXJpYWJsZVwiKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlUeXBlID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS10eXBlXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydnbG9iYWwnXX0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWxsIHRoZXNlIGFyZSBqdXN0IHZhcmlhYmxlcyB0aGF0IGFyZSB1c2VkIHRvIGNvbnN0cnVjdCBrdWJlY29uZmlnLiBUaGV5IGFyZSBtb3N0bHkgc3RyaW5ncyBhbmQgbm90IHVzZWQgaW4gY29udGV4dC5cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB2YWxpZGF0ZSB0aG9zZVxuICAgICAgICAgICAgICAgIC8vIFRPRE86IENvbnN0cnVjdCBrdWJlY29uZmlnIGluIGNvbnRyb2xsZXIgYmVmb3JlIHNldHRpbmcgdG8gY29udGV4dFxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktaW5jbHVzdGVyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiSW5DbHVzdGVyXCIpLmFwcGVuZFRvKHJvdzIpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eUluQ2x1c3RlciA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktaW5jbHVzdGVyXCIsdHlwZTpcImNoZWNrYm94XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93MilcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnYm9vbCddfSk7XG5cbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LWNsdXN0ZXJuYW1lXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQ2x1c3RlciBOYW1lXCIpLmFwcGVuZFRvKHJvdzMpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eUNsdXN0ZXJOYW1lID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1jbHVzdGVybmFtZVwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8ocm93MylcbiAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnc3RyJ119KTtcblxuICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktc2VydmVyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiU2VydmVyXCIpLmFwcGVuZFRvKHJvdzQpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVNlcnZlciA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktc2VydmVyXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3c0KVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG4gICAgICAgICAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS11c2VyXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiVXNlclwiKS5hcHBlbmRUbyhyb3c1KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlVc2VyPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXVzZXJcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzUpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ3N0ciddfSk7XG5cbiAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXBhc3N3b3JkXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiUGFzc3dvcmRcIikuYXBwZW5kVG8ocm93Nik7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5UGFzc3dvcmQgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXBhc3N3b3JkXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3c2KVxuICAgICAgICAgICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG5cblxuICAgICAgICAgICAgICAgIHByb3BlcnR5VHlwZS50eXBlZElucHV0KCd2YWx1ZScsIHByb3BlcnR5LnNvdXJjZWNsdXN0ZXJuYW1lKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUluQ2x1c3Rlci50eXBlZElucHV0KCd2YWx1ZScscHJvcGVydHkuaW5jbHVzdGVyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUNsdXN0ZXJOYW1lLnR5cGVkSW5wdXQoJ3ZhbHVlJyxwcm9wZXJ0eS5jbHVzdGVybmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlTZXJ2ZXIudHlwZWRJbnB1dCgndmFsdWUnLHByb3BlcnR5LnNlcnZlcik7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlVc2VyLnR5cGVkSW5wdXQoJ3ZhbHVlJyxwcm9wZXJ0eS51c2VyKTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVBhc3N3b3JkLnR5cGVkSW5wdXQoJ3ZhbHVlJyxwcm9wZXJ0eS5wYXNzd29yZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3V2lkdGggPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIHJlc2l6ZUNvbmZpZyhjb250YWluZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2l6ZUl0ZW06IHJlc2l6ZUNvbmZpZyxcbiAgICAgICAgICAgIHJlbW92YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNvcnRhYmxlOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKS5lZGl0YWJsZUxpc3QoJ2FkZEl0ZW1zJywgdGhpcy5jb25maWcpO1xuICAgIH0sXG4gICAgb25lZGl0c2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gJChcIiNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXJcIikuZWRpdGFibGVMaXN0KCdpdGVtcycpO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIHByb3BlcnRpZXMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSAkKHRoaXMpO1xuICAgICAgICAgICAgbm9kZS5jb25maWcgPSBbXVxuICAgICAgICAgICAgdmFyIHA6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgc291cmNlY2x1c3Rlcm5hbWU6IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jb25maWctcHJvcGVydHktdHlwZVwiKS50eXBlZElucHV0KCd2YWx1ZScpLFxuICAgICAgICAgICAgICAgIGluY2x1c3RlcjogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1pbmNsdXN0ZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICBjbHVzdGVybmFtZTogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1jbHVzdGVybmFtZVwiKS50eXBlZElucHV0KCd2YWx1ZScpLFxuICAgICAgICAgICAgICAgIHNlcnZlcjogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1zZXJ2ZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICB1c2VyOiBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtY29uZmlnLXByb3BlcnR5LXVzZXJcIikudHlwZWRJbnB1dCgndmFsdWUnKSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNvbmZpZy1wcm9wZXJ0eS1wYXNzd29yZFwiKS50eXBlZElucHV0KCd2YWx1ZScpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5vZGUuY29uZmlnLnB1c2gocCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgYnV0dG9uOiB7XG4gICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiY29uZmlnL1wiK3RoaXMuaWQsXG4gICAgICAgICAgICAgICAgdHlwZTpcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJDb25maWd1cmF0aW9uIHJlc2V0XCIsXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLHRleHRTdGF0dXMsZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGpxWEhSLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJOb2RlIG5vdCBkZXBsb3llZFwiLFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoanFYSFIuc3RhdHVzID09IDUwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUkVELm5vdGlmeShcIkNvbmZpZ3VyYXRpb24gcmVzZXQgZmFpbGVkXCIsXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqcVhIUi5zdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgUkVELm5vdGlmeShcIk5vIHJlc3BvbnNlXCIsXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFRC5ub3RpZnkoXCJVbmV4cGVjdGVkIGVycm9yIFwiICsgdGV4dFN0YXR1cyxcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdCYXNpY0VkaXRvcjtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlQ29uZmlnIHtcbiAgICBzb3VyY2VDbHVzdGVyTmFtZTogc3RyaW5nO1xufVxuXG5cbmV4cG9ydCBjb25zdCBDb250cm9sbGVyID0ge1xuICAgIG5hbWU6IFwiY3JlYXRlLW5hbWVzcGFjZVwiLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7TmFtZXNwYWNlQ29uZmlnLCBDb250cm9sbGVyfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBOYW1lc3BhY2VFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBhY3RpdmU6IGJvb2xlYW47XG4gICAgY29uZmlnOiBOYW1lc3BhY2VDb25maWc7XG59XG5cbmNvbnN0IGRlZmF1bHROYW1lc3BhY2VDb25maWc6IE5hbWVzcGFjZUNvbmZpZyA9IHtcbiAgICBzb3VyY2VDbHVzdGVyTmFtZTogXCJcIiwgLy8gTmFtZSBpcyB1c2VkIGFzIHRoZSBjb250ZXh0IG5hbWVcbn1cblxuXG5jb25zdCBOYW1lc3BhY2VFZGl0b3I6IEVkaXRvck5vZGVEZWY8TmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjYTZiYmNmJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6XCJcIn0sXG4gICAgICAgIGFjdGl2ZToge3ZhbHVlOnRydWV9LFxuICAgICAgICBjb25maWc6IHt2YWx1ZTogZGVmYXVsdE5hbWVzcGFjZUNvbmZpZ30sXG4gICAgfSxcbiAgICBpbnB1dHM6MSxcbiAgICBvdXRwdXRzOjEsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIGxhYmVsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXx8Q29udHJvbGxlci5uYW1lO1xuICAgIH0sXG4gICAgb25lZGl0cHJlcGFyZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIENsdXN0ZXIgY29uZmlnIGNvbnRhaW5lclxuICAgICAgICB2YXIgY29udGFpbmVyID0gJCgnI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lcicpXG4gICAgICAgIHZhciByb3cxID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWNsdXN0ZXItbmFtZS1wcm9wZXJ0eS10eXBlXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiTmFtZVwiKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jbHVzdGVyLW5hbWUtcHJvcGVydHktdHlwZVwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzEpXG4gICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydnbG9iYWwnXX0pO1xuXG4gICAgICAgIHByb3BlcnR5VHlwZS50eXBlZElucHV0KCd2YWx1ZScsdGhpcy5jb25maWcuc291cmNlQ2x1c3Rlck5hbWUpO1xuICAgIH0sXG4gICAgb25lZGl0c2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEZpbmQgY2xpZW50IHNvdXJjZSBkZXRhaWxzXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9ICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIG5vZGUuY29uZmlnLnNvdXJjZUNsdXN0ZXJOYW1lID0gcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWNsdXN0ZXItbmFtZS1wcm9wZXJ0eS10eXBlXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyk7XG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlRWRpdG9yO1xuIiwiZXhwb3J0IGludGVyZmFjZSBOYW1lc3BhY2VDb25maWcge1xuICAgIHNvdXJjZUNsdXN0ZXJOYW1lOiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGNvbnN0IENvbnRyb2xsZXIgPSB7XG4gICAgbmFtZTogXCJsaXN0LW5hbWVzcGFjZXNcIixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVzcGFjZUNvbmZpZztcblxuIiwiaW1wb3J0IHsgRWRpdG9yTm9kZURlZiwgRWRpdG9yTm9kZVByb3BlcnRpZXMgfSBmcm9tICdub2RlLXJlZCc7XG5pbXBvcnQge05hbWVzcGFjZUNvbmZpZywgQ29udHJvbGxlcn0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcyBleHRlbmRzIEVkaXRvck5vZGVQcm9wZXJ0aWVzIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIGNvbmZpZzogTmFtZXNwYWNlQ29uZmlnO1xufVxuXG5jb25zdCBkZWZhdWx0TmFtZXNwYWNlQ29uZmlnOiBOYW1lc3BhY2VDb25maWcgPSB7XG4gICAgc291cmNlQ2x1c3Rlck5hbWU6IFwiXCIsIC8vIE5hbWUgaXMgdXNlZCBhcyB0aGUgY29udGV4dCBuYW1lXG59XG5cblxuY29uc3QgTmFtZXNwYWNlRWRpdG9yOiBFZGl0b3JOb2RlRGVmPE5hbWVzcGFjZUVkaXRvclByb3BlcnRpZXM+ID0ge1xuICAgIGNhdGVnb3J5OiAnZnVuY3Rpb24nLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBhY3RpdmU6IHt2YWx1ZTp0cnVlfSxcbiAgICAgICAgY29uZmlnOiB7dmFsdWU6IGRlZmF1bHROYW1lc3BhY2VDb25maWd9LFxuICAgIH0sXG4gICAgaW5wdXRzOjEsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBDbHVzdGVyIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKVxuICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jbHVzdGVyLW5hbWUtcHJvcGVydHktdHlwZVwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIk5hbWVcIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY2x1c3Rlci1uYW1lLXByb3BlcnR5LXR5cGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZ2xvYmFsJ119KTtcblxuICAgICAgICBwcm9wZXJ0eVR5cGUudHlwZWRJbnB1dCgndmFsdWUnLHRoaXMuY29uZmlnLnNvdXJjZUNsdXN0ZXJOYW1lKTtcbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmNvbmZpZy5zb3VyY2VDbHVzdGVyTmFtZSA9IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jbHVzdGVyLW5hbWUtcHJvcGVydHktdHlwZVwiKS50eXBlZElucHV0KCd2YWx1ZScpO1xuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVzcGFjZUVkaXRvcjtcbiIsImV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlQ29uZmlnIHtcbiAgICBzb3VyY2VDbHVzdGVyTmFtZTogc3RyaW5nO1xuICAgIGFjdGlvbjogc3RyaW5nO1xufVxuXG5cbmV4cG9ydCBjb25zdCBDb250cm9sbGVyID0ge1xuICAgIG5hbWU6IFwibmFtZXNwYWNlXCIsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBOYW1lc3BhY2VDb25maWc7XG5cbiIsImltcG9ydCB7IEVkaXRvck5vZGVEZWYsIEVkaXRvck5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnbm9kZS1yZWQnO1xuaW1wb3J0IHtOYW1lc3BhY2VDb25maWcsIENvbnRyb2xsZXJ9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5hbWVzcGFjZUVkaXRvclByb3BlcnRpZXMgZXh0ZW5kcyBFZGl0b3JOb2RlUHJvcGVydGllcyB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICBjb25maWc6IE5hbWVzcGFjZUNvbmZpZztcbn1cblxuY29uc3QgZGVmYXVsdE5hbWVzcGFjZUNvbmZpZzogTmFtZXNwYWNlQ29uZmlnID0ge1xuICAgIHNvdXJjZUNsdXN0ZXJOYW1lOiBcImt1YmVjb25maWdcIiwgLy8gTmFtZSBpcyB1c2VkIGFzIHRoZSBjb250ZXh0IG5hbWVcbiAgICBhY3Rpb246IFwiY3JlYXRlXCIsXG59XG5cblxuY29uc3QgTmFtZXNwYWNlRWRpdG9yOiBFZGl0b3JOb2RlRGVmPE5hbWVzcGFjZUVkaXRvclByb3BlcnRpZXM+ID0ge1xuICAgIGNhdGVnb3J5OiAnZnVuY3Rpb24nLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBhY3RpdmU6IHt2YWx1ZTp0cnVlfSxcbiAgICAgICAgY29uZmlnOiB7dmFsdWU6IGRlZmF1bHROYW1lc3BhY2VDb25maWd9LFxuICAgIH0sXG4gICAgaW5wdXRzOjEsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0aW9uOiBzdHJpbmdcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0QWN0aW9uKGV2OiBFdmVudCkge1xuICAgICAgICAgICB2YXIgdCA9IGV2LnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudDsgLy8gY29udmVydCB0byBiYXNpYyBlbGVtZW50XG4gICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcjbm9kZS1pbnB1dC1hY3Rpb24tY29uZmlndXJhdGlvbicpXG4gICAgICAgICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgICAgICAgIHZhciByb3cxID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgICAgc3dpdGNoKHQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiY3JlYXRlXCI6XG4gICAgICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jcmVhdGVcIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJDcmVhdGVcIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgICAgICAgICAgICAgICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jcmVhdGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZ2xvYmFsJ119KTtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1kZWxldGVcIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJEZWxldGVcIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgICAgICAgICAgICAgICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1kZWxldGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzEpXG4gICAgICAgICAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ3N0ciddfSk7XG4gICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vIENsdXN0ZXIgY29uZmlnIGNvbnRhaW5lclxuICAgICAgICAvLyBUT0RPOiBUaGlzIHdpbGwgYmUgc2hhcmVkIGZvciBhbGwgbm9kZXMvcmVzb3VyY2VzLiBXZSBzaG91bGQgbW92ZSBpdCB0byBhIHNoYXJlZCBmaWxlXG4gICAgICAgIHZhciBjb250YWluZXIgPSAkKCcjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyJylcbiAgICAgICAgdmFyIHJvdzEgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY2x1c3Rlci1uYW1lXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQ2x1c3RlclwiKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9ICQoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jbHVzdGVyLW5hbWVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKVxuICAgICAgICAgICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZ2xvYmFsJ119KTtcblxuICAgICAgICB2YXIgcm93MiA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1hY3Rpb25cIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJBY3Rpb25cIikuYXBwZW5kVG8ocm93Mik7XG4gICAgICAgIHZhciBwcm9wZXJ0eUFjdGlvbiA9ICQoJzxzZWxlY3QvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtYWN0aW9uXCIsXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byByZW5kZXIgdGhlIGNvcnJlY3QgZmllbGRzXG4gICAgICAgICAgICBvbmNoYW5nZTogZnVuY3Rpb24oZXY6IEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2VsZWN0QWN0aW9uKTtcbiAgICAgICAgICAgIH19KVxuICAgICAgICAuYXBwZW5kVG8ocm93Mik7XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXCJjcmVhdGVcIiwgXCJkZWxldGVcIiwgXCJsaXN0XCIsIFwiZ2V0XCIsIFwiYXBwbHlcIiwgXCJ3YXRjaFwiXTtcbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBwcm9wZXJ0eUFjdGlvbi5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGFjdGlvbixcbiAgICAgICAgICAgICAgICB0ZXh0IDogYWN0aW9uLFxuICAgICAgICAgICAgfSkpLmFwcGVuZFRvKHJvdzIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wZXJ0eVR5cGUudHlwZWRJbnB1dCgndmFsdWUnLHRoaXMuY29uZmlnLnNvdXJjZUNsdXN0ZXJOYW1lKTtcbiAgICAgICAgcHJvcGVydHlBY3Rpb24udmFsKHRoaXMuY29uZmlnLmFjdGlvbik7XG5cbiAgICAgICAgLy8gVE9ETzogUHJlbG9hZCB0aGUgY29ycmVjdCBmaWVsZHMgYmFzZWQgb24gdGhlIGFjdGlvblxuICAgICAgICAvL3ZhciBhY3Rpb24gPSAkKFwiI25vZGUtaW5wdXQtYWN0aW9uLWNvbmZpZ3VyYXRpb25cIik7XG5cbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmNvbmZpZy5zb3VyY2VDbHVzdGVyTmFtZSA9IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1jbHVzdGVyLW5hbWVcIikudHlwZWRJbnB1dCgndmFsdWUnKTtcbiAgICAgICAgbm9kZS5jb25maWcuYWN0aW9uID0gcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWFjdGlvbiA6c2VsZWN0ZWRcIikudGV4dCgpO1xuXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlRWRpdG9yO1xuIiwiaW1wb3J0IHsgRWRpdG9yUkVEIH0gZnJvbSBcIm5vZGUtcmVkXCI7XG5pbXBvcnQgQ2x1c3RlckVkaXRvckJhc2ljIGZyb20gXCIuL2NsdXN0ZXItY29uZmlnL2VkaXRvclwiO1xuaW1wb3J0ICogYXMgQ3JlYXRlTmFtZXNwYWNlRWRpdG9yIGZyb20gXCIuL2NyZWF0ZS1uYW1lc3BhY2UvZWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBMaXN0TmFtZXNwYWNlc0VkaXRvciBmcm9tIFwiLi9saXN0LW5hbWVzcGFjZXMvZWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBOYW1lc3BhY2VFZGl0b3IgZnJvbSBcIi4vbmFtZXNwYWNlL2VkaXRvclwiO1xuXG5pbXBvcnQgKiBhcyBDcmVhdGVOYW1lc3BhY2UgZnJvbSBcIi4vY3JlYXRlLW5hbWVzcGFjZS90eXBlc1wiO1xuaW1wb3J0ICogYXMgTGlzdE5hbWVzcGFjZXMgZnJvbSBcIi4vbGlzdC1uYW1lc3BhY2VzL3R5cGVzXCI7XG5pbXBvcnQgKiBhcyBOYW1lc3BhY2UgZnJvbSBcIi4vbmFtZXNwYWNlL3R5cGVzXCI7XG5cbmltcG9ydCAqIGFzIENsdXN0ZXJDb25maWcgZnJvbSBcIi4vY2x1c3Rlci1jb25maWcvdHlwZXNcIjtcblxuXG5kZWNsYXJlIGNvbnN0IFJFRDogRWRpdG9yUkVEO1xuXG4vLyBmZXRjaCBkaXNjb3ZlcmVkIHR5cGVzIGZyb20gdGhlIGJhY2tlbmQsXG4vLyBhbmQgZm9yIGVhY2ggdHlwZSwgcmVnaXN0ZXIgYSBrdWJlIG5vZGUgKGkuZS4gZGVwbG95bWVudCwgbm9kZXMsIHBvZHMsIGV0Yy4gZXRjLiBpbmNsdWRpbmcgQ1JEcylcbi8vIGluIG5vZGUtcmVkXG5cbi8vIGZvciB0eXBlIDo9IHJhbmdlIGRpc2NvdmVyZWRUeXBlcyB7XG4vLyAgICAgUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcInBvZHNcIiwgUG9kc0VkaXRvcik7XG4vLyB9XG5cblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoQ2x1c3RlckNvbmZpZy5Db250cm9sbGVyLm5hbWUsIENsdXN0ZXJFZGl0b3JCYXNpYyk7XG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKENyZWF0ZU5hbWVzcGFjZS5Db250cm9sbGVyLm5hbWUsIENyZWF0ZU5hbWVzcGFjZUVkaXRvci5kZWZhdWx0KTtcblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoTGlzdE5hbWVzcGFjZXMuQ29udHJvbGxlci5uYW1lLCBMaXN0TmFtZXNwYWNlc0VkaXRvci5kZWZhdWx0KTtcblxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShOYW1lc3BhY2UuQ29udHJvbGxlci5uYW1lLCBOYW1lc3BhY2VFZGl0b3IuZGVmYXVsdCk7XG4iXSwibmFtZXMiOlsiQ29udHJvbGxlciIsImRlZmF1bHROYW1lc3BhY2VDb25maWciLCJOYW1lc3BhY2VFZGl0b3IiLCJDbHVzdGVyQ29uZmlnLkNvbnRyb2xsZXIiLCJDbHVzdGVyRWRpdG9yQmFzaWMiLCJDcmVhdGVOYW1lc3BhY2UuQ29udHJvbGxlciIsIkNyZWF0ZU5hbWVzcGFjZUVkaXRvci5kZWZhdWx0IiwiTGlzdE5hbWVzcGFjZXMuQ29udHJvbGxlciIsIkxpc3ROYW1lc3BhY2VzRWRpdG9yLmRlZmF1bHQiLCJOYW1lc3BhY2UuQ29udHJvbGxlciIsIk5hbWVzcGFjZUVkaXRvci5kZWZhdWx0Il0sIm1hcHBpbmdzIjoiOzs7SUFTTyxNQUFNQSxZQUFVLEdBQUc7SUFDdEIsSUFBQSxJQUFJLEVBQUUsZ0JBQWdCO0tBQ3pCOztJQ05ELE1BQU0sb0JBQW9CLEdBQWtCO0lBQ3hDLElBQUEsaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixJQUFBLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLElBQUEsV0FBVyxFQUFFLEVBQUU7SUFDZixJQUFBLE1BQU0sRUFBRSxFQUFFO0lBQ1YsSUFBQSxJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUEsUUFBUSxFQUFFLEVBQUU7S0FDZixDQUFBO0lBUUQsTUFBTSx3QkFBd0IsR0FBc0Q7SUFDaEYsSUFBQSxRQUFRLEVBQUUsVUFBVTtJQUNwQixJQUFBLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUEsUUFBUSxFQUFFO0lBQ04sUUFBQSxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDO0lBQ2pCLFFBQUEsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQztJQUNyQixRQUFBLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUM7SUFDMUMsS0FBQTtJQUNELElBQUEsTUFBTSxFQUFDLENBQUM7SUFDUixJQUFBLE9BQU8sRUFBQyxDQUFDO0lBQ1QsSUFBQSxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFBLEtBQUssRUFBRSxZQUFBO0lBQ0gsUUFBQSxP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