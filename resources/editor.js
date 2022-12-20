(function () {
    'use strict';

    const defaultClusterConfig = {
        incluster: true,
        server: "https://api.server:8443",
        user: "cluster-admin",
        password: "",
    };
    const Controller$2 = {
        name: "cluster-config",
        defaults: defaultClusterConfig,
    };

    const ClusterConfigEditor = {
        category: 'config',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            config: { value: Controller$2.defaults },
        },
        inputs: 0,
        outputs: 0,
        icon: "file.png",
        oneditsave: oneditsave,
        oneditprepare: oneditprepare,
        label: function () {
            return this.name || Controller$2.name;
        }
    };
    function oneditsave() {
        this.config = Controller$2.defaults;
        this.name = $("#node-input-name").val();
        this.config.server = $("#node-input-server").val();
        this.config.incluster = $("#node-input-incluster").is(":checked");
        this.config.user = $("#node-input-user").val();
        this.config.password = $("#node-input-password").val();
    }
    function oneditprepare() {
        // Add hooks to disable form fields when incluster is checked
        var container = $("#node-input-incluster");
        container.on('change', function () {
            $("#node-input-server").prop("disabled", container.is(":checked"));
            $("#node-input-user").prop("disabled", container.is(":checked"));
            $("#node-input-password").prop("disabled", container.is(":checked"));
        });
        // restore form values
        $("#node-input-name").val(this.name);
        $("#node-input-incluster").prop("checked", this.config.incluster);
        $("#node-input-server").val(this.config.server);
        $("#node-input-user").val(this.config.user);
        $("#node-input-password").val(this.config.password);
        // On restore disable if needed
        $("#node-input-server").prop("disabled", this.config.incluster);
        $("#node-input-user").prop("disabled", this.config.incluster);
        $("#node-input-password").prop("disabled", this.config.incluster);
    }

    // TODO: Watch is not implemented yet
    const actions$1 = ["create", "delete", "list", "get", "update", "patch"];
    const Controller$1 = {
        name: "namespace",
        actions: actions$1,
    };

    const NamespaceEditor = {
        category: 'kubernetes',
        color: "#326DE6",
        icon: "kubernetes_logo_40x60_white.png",
        align: "left",
        defaults: {
            name: { value: "" },
            cluster: { value: "", type: Controller$2.name, required: true },
            action: { value: "-" },
        },
        inputs: 1,
        outputs: 1,
        label: function () {
            return this.name || Controller$1.name;
        },
        oneditprepare: function () {
            // Example how to add a new row on action selection using switch
            // select action and show/hide the appropriate form
            // function selectAction(ev: Event) {
            //  var t = ev.target as HTMLSelectElement; // convert to basic element
            //
            //  var container = $('#node-input-action-configuration')
            //     container.empty();
            //  var row1 = $('<div/>').appendTo(container);
            //  ('<label/>',{for:"node-input-create",style:"width:110px; margin-right:10px;"}).text("Create").appendTo(row1);
            //  ('<input/>',{style:"width:250px",class:"node-input-create",type:"text"})
            //   .appendTo(row1)
            //   .typedInput({types:['global']});
            // }
            // Action config container
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            $('<label/>', { for: "node-input-action", style: "width:110px; margin-right:10px;" }).text("Action").appendTo(row1);
            var propertyAction = $('<select/>', { style: "width:250px", class: "node-input-action",
                // Add event listener to render the correct fields
                onchange: function (ev) {
                    // event listener for example above
                    // addEventListener('change', selectAction);
                } })
                .appendTo(row1);
            Controller$1.actions.forEach(action => {
                propertyAction.append($('<option>', {
                    value: action,
                    text: action,
                })).appendTo(row1);
            });
            propertyAction.val(this.action);
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.action = property.find(".node-input-action :selected").text();
        },
    };

    // TODO: Watch is not implemented yet
    const actions = ["create", "delete", "list", "get", "update", "patch"];
    const Controller = {
        name: "configmap",
        actions: actions,
    };

    const ConfigMapEditor = {
        category: 'kubernetes',
        color: "#326DE6",
        icon: "kubernetes_logo_40x60_white.png",
        align: "left",
        defaults: {
            name: { value: "" },
            namespace: { value: "" },
            cluster: { value: "", type: Controller$2.name, required: true },
            action: { value: "-" },
        },
        inputs: 1,
        outputs: 1,
        label: function () {
            return this.name || Controller.name;
        },
        oneditprepare: function () {
            // Action config container
            var container = $('#node-input-config-container');
            var row1 = $('<div/>').appendTo(container);
            var row2 = $('<div/>', { style: "margin-top:8px;" }).appendTo(container);
            $('<label/>', { for: "node-input-action", style: "width:110px; margin-right:10px;" }).text("Action").appendTo(row1);
            var propertyAction = $('<select/>', { style: "width:250px", class: "node-input-action" })
                .appendTo(row1);
            Controller.actions.forEach(action => {
                propertyAction.append($('<option>', {
                    value: action,
                    text: action,
                })).appendTo(row1);
            });
            $('<label/>', { for: "node-input-namespace", style: "width:110px; margin-right:10px;" }).text("Namespace").appendTo(row2);
            var propertyNamespace = $('<input/>', { style: "width:250px", class: "node-input-namespace", type: "text" })
                .appendTo(row2)
                .typedInput({ types: ['str'] });
            propertyNamespace.typedInput('value', this.namespace);
            propertyAction.val(this.action);
        },
        oneditsave: function () {
            // Find client source details
            var property = $("#node-input-config-container");
            var node = this;
            node.action = property.find(".node-input-action :selected").text();
            node.namespace = property.find(".node-input-namespace").typedInput('value');
        },
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("cluster-config", ClusterConfigEditor);
    RED.nodes.registerType("namespace", NamespaceEditor);
    RED.nodes.registerType("configmap", ConfigMapEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL25hbWVzcGFjZS90eXBlcy50cyIsInNyYy9uYW1lc3BhY2UvZWRpdG9yLnRzIiwic3JjL2NvbmZpZ21hcC90eXBlcy50cyIsInNyYy9jb25maWdtYXAvZWRpdG9yLnRzIiwic3JjL2VkaXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWcge1xuICAgIGluY2x1c3RlcjogYm9vbGVhbjtcbiAgICBzZXJ2ZXI6IHN0cmluZztcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdENsdXN0ZXJDb25maWc6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgaW5jbHVzdGVyOiB0cnVlLFxuICAgIHNlcnZlcjogXCJodHRwczovL2FwaS5zZXJ2ZXI6ODQ0M1wiLFxuICAgIHVzZXI6IFwiY2x1c3Rlci1hZG1pblwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxufVxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNsdXN0ZXItY29uZmlnXCIsXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRDbHVzdGVyQ29uZmlnLFxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIsIENsdXN0ZXJDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWdFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZztcbn1cblxuY29uc3QgQ2x1c3RlckNvbmZpZ0VkaXRvcjogRWRpdG9yTm9kZURlZjxDbHVzdGVyQ29uZmlnRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdjb25maWcnLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjb25maWc6IHt2YWx1ZTogQ29udHJvbGxlci5kZWZhdWx0c30sXG4gICAgfSxcbiAgICBpbnB1dHM6MCxcbiAgICBvdXRwdXRzOjAsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIG9uZWRpdHNhdmU6IG9uZWRpdHNhdmUsXG4gICAgb25lZGl0cHJlcGFyZTogb25lZGl0cHJlcGFyZSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdFZGl0b3I7XG5cbmZ1bmN0aW9uIG9uZWRpdHNhdmUoKSB7XG4gICAgdGhpcy5jb25maWcgPSBDb250cm9sbGVyLmRlZmF1bHRzO1xuXG4gICAgdGhpcy5uYW1lID0gJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKClcbiAgICB0aGlzLmNvbmZpZy5zZXJ2ZXIgPSAkKFwiI25vZGUtaW5wdXQtc2VydmVyXCIpLnZhbCgpO1xuICAgIHRoaXMuY29uZmlnLmluY2x1c3RlciA9ICQoXCIjbm9kZS1pbnB1dC1pbmNsdXN0ZXJcIikuaXMoXCI6Y2hlY2tlZFwiKTtcbiAgICB0aGlzLmNvbmZpZy51c2VyID0gJChcIiNub2RlLWlucHV0LXVzZXJcIikudmFsKCk7XG4gICAgdGhpcy5jb25maWcucGFzc3dvcmQgPSAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikudmFsKCk7XG59XG5cbmZ1bmN0aW9uIG9uZWRpdHByZXBhcmUoKSB7XG4gICAgLy8gQWRkIGhvb2tzIHRvIGRpc2FibGUgZm9ybSBmaWVsZHMgd2hlbiBpbmNsdXN0ZXIgaXMgY2hlY2tlZFxuICAgIHZhciBjb250YWluZXIgPSAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpO1xuICAgIGNvbnRhaW5lci5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoXCIjbm9kZS1pbnB1dC1zZXJ2ZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXVzZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnByb3AoXCJkaXNhYmxlZFwiLCBjb250YWluZXIuaXMoXCI6Y2hlY2tlZFwiKSk7XG4gICAgfSk7XG5cbiAgICAvLyByZXN0b3JlIGZvcm0gdmFsdWVzXG4gICAgJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKHRoaXMubmFtZSlcbiAgICAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpLnByb3AoXCJjaGVja2VkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS52YWwodGhpcy5jb25maWcuc2VydmVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS52YWwodGhpcy5jb25maWcudXNlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnZhbCh0aGlzLmNvbmZpZy5wYXNzd29yZCk7XG5cbiAgICAvLyBPbiByZXN0b3JlIGRpc2FibGUgaWYgbmVlZGVkXG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikucHJvcChcImRpc2FibGVkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG5cbn1cbiIsIi8vIFRPRE86IFdhdGNoIGlzIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbmV4cG9ydCBjb25zdCBhY3Rpb25zID0gW1wiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwibGlzdFwiLCBcImdldFwiLCBcInVwZGF0ZVwiLCBcInBhdGNoXCJdO1xuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcIm5hbWVzcGFjZVwiLFxuICAgIGFjdGlvbnM6IGFjdGlvbnMsXG59O1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENvbnRyb2xsZXIgYXMgQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXJ9IGZyb20gJy4uL2NsdXN0ZXItY29uZmlnL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBOYW1lc3BhY2VFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNsdXN0ZXI6IHN0cmluZztcblxuICAgIGFjdGlvbjogc3RyaW5nO1xufVxuXG5cbmNvbnN0IE5hbWVzcGFjZUVkaXRvcjogRWRpdG9yTm9kZURlZjxOYW1lc3BhY2VFZGl0b3JQcm9wZXJ0aWVzPiA9IHtcbiAgICBjYXRlZ29yeTogJ2t1YmVybmV0ZXMnLFxuICAgIGNvbG9yOiBcIiMzMjZERTZcIixcbiAgICBpY29uOiBcImt1YmVybmV0ZXNfbG9nb180MHg2MF93aGl0ZS5wbmdcIixcbiAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjbHVzdGVyOiB7dmFsdWU6IFwiXCIsIHR5cGU6IENsdXN0ZXJDb25maWdDb250cm9sbGVyLm5hbWUsIHJlcXVpcmVkOiB0cnVlfSxcbiAgICAgICAgYWN0aW9uOiB7dmFsdWU6IFwiLVwifSxcbiAgICB9LFxuICAgIGlucHV0czoxLFxuICAgIG91dHB1dHM6MSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBFeGFtcGxlIGhvdyB0byBhZGQgYSBuZXcgcm93IG9uIGFjdGlvbiBzZWxlY3Rpb24gdXNpbmcgc3dpdGNoXG4gICAgICAgIC8vIHNlbGVjdCBhY3Rpb24gYW5kIHNob3cvaGlkZSB0aGUgYXBwcm9wcmlhdGUgZm9ybVxuICAgICAgICAvLyBmdW5jdGlvbiBzZWxlY3RBY3Rpb24oZXY6IEV2ZW50KSB7XG4gICAgICAgIC8vICB2YXIgdCA9IGV2LnRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudDsgLy8gY29udmVydCB0byBiYXNpYyBlbGVtZW50XG4gICAgICAgIC8vXG4gICAgICAgIC8vICB2YXIgY29udGFpbmVyID0gJCgnI25vZGUtaW5wdXQtYWN0aW9uLWNvbmZpZ3VyYXRpb24nKVxuICAgICAgICAvLyAgICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAgIC8vICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgIC8vICAoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1jcmVhdGVcIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJDcmVhdGVcIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIC8vICAoJzxpbnB1dC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1jcmVhdGVcIix0eXBlOlwidGV4dFwifSlcbiAgICAgICAgLy8gICAuYXBwZW5kVG8ocm93MSlcbiAgICAgICAgLy8gICAudHlwZWRJbnB1dCh7dHlwZXM6WydnbG9iYWwnXX0pO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gQWN0aW9uIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKVxuXG4gICAgICAgIHZhciByb3cxID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LWFjdGlvblwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIkFjdGlvblwiKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgdmFyIHByb3BlcnR5QWN0aW9uID0gJCgnPHNlbGVjdC8+Jyx7c3R5bGU6XCJ3aWR0aDoyNTBweFwiLGNsYXNzOlwibm9kZS1pbnB1dC1hY3Rpb25cIixcbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyIHRvIHJlbmRlciB0aGUgY29ycmVjdCBmaWVsZHNcbiAgICAgICAgICAgIG9uY2hhbmdlOiBmdW5jdGlvbihldjogRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBldmVudCBsaXN0ZW5lciBmb3IgZXhhbXBsZSBhYm92ZVxuICAgICAgICAgICAgICAgIC8vIGFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGVjdEFjdGlvbik7XG4gICAgICAgICAgICB9fSlcbiAgICAgICAgLmFwcGVuZFRvKHJvdzEpO1xuXG4gICAgICAgIENvbnRyb2xsZXIuYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBwcm9wZXJ0eUFjdGlvbi5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGFjdGlvbixcbiAgICAgICAgICAgICAgICB0ZXh0IDogYWN0aW9uLFxuICAgICAgICAgICAgfSkpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wZXJ0eUFjdGlvbi52YWwodGhpcy5hY3Rpb24pO1xuICAgIH0sXG4gICAgb25lZGl0c2F2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEZpbmQgY2xpZW50IHNvdXJjZSBkZXRhaWxzXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9ICQoXCIjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyXCIpO1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgICAgIG5vZGUuYWN0aW9uID0gcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LWFjdGlvbiA6c2VsZWN0ZWRcIikudGV4dCgpO1xuXG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlRWRpdG9yO1xuIiwiLy8gVE9ETzogV2F0Y2ggaXMgbm90IGltcGxlbWVudGVkIHlldFxuZXhwb3J0IGNvbnN0IGFjdGlvbnMgPSBbXCJjcmVhdGVcIiwgXCJkZWxldGVcIiwgXCJsaXN0XCIsIFwiZ2V0XCIsIFwidXBkYXRlXCIsIFwicGF0Y2hcIl07XG5cbmV4cG9ydCBjb25zdCBDb250cm9sbGVyID0ge1xuICAgIG5hbWU6IFwiY29uZmlnbWFwXCIsXG4gICAgYWN0aW9uczogYWN0aW9ucyxcbn07XG5cbiIsImltcG9ydCB7IEVkaXRvck5vZGVEZWYsIEVkaXRvck5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnbm9kZS1yZWQnO1xuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ29udHJvbGxlciBhcyBDbHVzdGVyQ29uZmlnQ29udHJvbGxlcn0gZnJvbSAnLi4vY2x1c3Rlci1jb25maWcvdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ01hcEVkaXRvclByb3BlcnRpZXMgZXh0ZW5kcyBFZGl0b3JOb2RlUHJvcGVydGllcyB7XG4gICAgY2x1c3Rlcjogc3RyaW5nO1xuXG4gICAgYWN0aW9uOiBzdHJpbmc7XG4gICAgbmFtZXNwYWNlOiBzdHJpbmc7XG59XG5cblxuY29uc3QgQ29uZmlnTWFwRWRpdG9yOiBFZGl0b3JOb2RlRGVmPENvbmZpZ01hcEVkaXRvclByb3BlcnRpZXM+ID0ge1xuICAgIGNhdGVnb3J5OiAna3ViZXJuZXRlcycsXG4gICAgY29sb3I6IFwiIzMyNkRFNlwiLFxuICAgIGljb246IFwia3ViZXJuZXRlc19sb2dvXzQweDYwX3doaXRlLnBuZ1wiLFxuICAgIGFsaWduOiBcImxlZnRcIixcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6XCJcIn0sXG4gICAgICAgIG5hbWVzcGFjZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjbHVzdGVyOiB7dmFsdWU6IFwiXCIsIHR5cGU6IENsdXN0ZXJDb25maWdDb250cm9sbGVyLm5hbWUsIHJlcXVpcmVkOiB0cnVlfSxcbiAgICAgICAgYWN0aW9uOiB7dmFsdWU6IFwiLVwifSxcbiAgICB9LFxuICAgIGlucHV0czoxLFxuICAgIG91dHB1dHM6MSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9LFxuICAgIG9uZWRpdHByZXBhcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBBY3Rpb24gY29uZmlnIGNvbnRhaW5lclxuICAgICAgICB2YXIgY29udGFpbmVyID0gJCgnI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lcicpXG5cbiAgICAgICAgdmFyIHJvdzEgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICB2YXIgcm93MiA9ICQoJzxkaXYvPicse3N0eWxlOlwibWFyZ2luLXRvcDo4cHg7XCJ9KS5hcHBlbmRUbyhjb250YWluZXIpO1xuXG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1hY3Rpb25cIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJBY3Rpb25cIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eUFjdGlvbiA9ICQoJzxzZWxlY3QvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtYWN0aW9uXCJ9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzEpO1xuXG4gICAgICAgIENvbnRyb2xsZXIuYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBwcm9wZXJ0eUFjdGlvbi5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGFjdGlvbixcbiAgICAgICAgICAgICAgICB0ZXh0IDogYWN0aW9uLFxuICAgICAgICAgICAgfSkpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtbmFtZXNwYWNlXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiTmFtZXNwYWNlXCIpLmFwcGVuZFRvKHJvdzIpO1xuICAgICAgICB2YXIgcHJvcGVydHlOYW1lc3BhY2UgPSAkKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtbmFtZXNwYWNlXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgICAgICAuYXBwZW5kVG8ocm93MilcbiAgICAgICAgICAgIC50eXBlZElucHV0KHt0eXBlczpbJ3N0ciddfSk7XG5cblxuICAgICAgICBwcm9wZXJ0eU5hbWVzcGFjZS50eXBlZElucHV0KCd2YWx1ZScsIHRoaXMubmFtZXNwYWNlKTtcbiAgICAgICAgcHJvcGVydHlBY3Rpb24udmFsKHRoaXMuYWN0aW9uKTtcbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmFjdGlvbiA9IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1hY3Rpb24gOnNlbGVjdGVkXCIpLnRleHQoKTtcbiAgICAgICAgbm9kZS5uYW1lc3BhY2UgPSBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtbmFtZXNwYWNlXCIpLnR5cGVkSW5wdXQoJ3ZhbHVlJyk7XG4gICAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uZmlnTWFwRWRpdG9yO1xuIiwiaW1wb3J0IHsgRWRpdG9yUkVEIH0gZnJvbSBcIm5vZGUtcmVkXCI7XG5pbXBvcnQgQ2x1c3RlckNvbmZpZ0VkaXRvciBmcm9tIFwiLi9jbHVzdGVyLWNvbmZpZy9lZGl0b3JcIjtcbmltcG9ydCBOYW1lc3BhY2VFZGl0b3IgZnJvbSBcIi4vbmFtZXNwYWNlL2VkaXRvclwiO1xuaW1wb3J0IENvbmZpZ01hcEVkaXRvciBmcm9tIFwiLi9jb25maWdtYXAvZWRpdG9yXCI7XG5cbmRlY2xhcmUgY29uc3QgUkVEOiBFZGl0b3JSRUQ7XG5cbi8vIGZldGNoIGRpc2NvdmVyZWQgdHlwZXMgZnJvbSB0aGUgYmFja2VuZCxcbi8vIGFuZCBmb3IgZWFjaCB0eXBlLCByZWdpc3RlciBhIGt1YmUgbm9kZSAoaS5lLiBkZXBsb3ltZW50LCBub2RlcywgcG9kcywgZXRjLiBldGMuIGluY2x1ZGluZyBDUkRzKVxuLy8gaW4gbm9kZS1yZWRcblxuLy8gZm9yIHR5cGUgOj0gcmFuZ2UgZGlzY292ZXJlZFR5cGVzIHtcbi8vICAgICBSRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwicG9kc1wiLCBQb2RzRWRpdG9yKTtcbi8vIH1cblxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcImNsdXN0ZXItY29uZmlnXCIsIENsdXN0ZXJDb25maWdFZGl0b3IpXG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwibmFtZXNwYWNlXCIsIE5hbWVzcGFjZUVkaXRvcilcblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoXCJjb25maWdtYXBcIiwgQ29uZmlnTWFwRWRpdG9yKVxuXG4iXSwibmFtZXMiOlsiQ29udHJvbGxlciIsImFjdGlvbnMiLCJDbHVzdGVyQ29uZmlnQ29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7O0lBT0EsTUFBTSxvQkFBb0IsR0FBa0I7SUFDeEMsSUFBQSxTQUFTLEVBQUUsSUFBSTtJQUNmLElBQUEsTUFBTSxFQUFFLHlCQUF5QjtJQUNqQyxJQUFBLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUEsUUFBUSxFQUFFLEVBQUU7S0FDZixDQUFBO0lBRU0sTUFBTUEsWUFBVSxHQUFHO0lBQ3RCLElBQUEsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFBLFFBQVEsRUFBRSxvQkFBb0I7S0FDakM7O0lDVkQsTUFBTSxtQkFBbUIsR0FBaUQ7SUFDdEUsSUFBQSxRQUFRLEVBQUUsUUFBUTtJQUNsQixJQUFBLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUEsUUFBUSxFQUFFO0lBQ04sUUFBQSxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxFQUFDO0lBQ2hCLFFBQUEsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFQSxZQUFVLENBQUMsUUFBUSxFQUFDO0lBQ3ZDLEtBQUE7SUFDRCxJQUFBLE1BQU0sRUFBQyxDQUFDO0lBQ1IsSUFBQSxPQUFPLEVBQUMsQ0FBQztJQUNULElBQUEsSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBQSxVQUFVLEVBQUUsVUFBVTtJQUN0QixJQUFBLGFBQWEsRUFBRSxhQUFhO0lBQzVCLElBQUEsS0FBSyxFQUFFLFlBQUE7SUFDSCxRQUFBLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBRUEsWUFBVSxDQUFDLElBQUksQ0FBQztTQUNyQztLQUNKLENBQUE7SUFJRCxTQUFTLFVBQVUsR0FBQTtJQUNmLElBQUEsSUFBSSxDQUFDLE1BQU0sR0FBR0EsWUFBVSxDQUFDLFFBQVEsQ0FBQztRQUVsQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxD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