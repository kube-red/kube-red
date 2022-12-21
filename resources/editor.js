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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL25hbWVzcGFjZS90eXBlcy50cyIsInNyYy9uYW1lc3BhY2UvZWRpdG9yLnRzIiwic3JjL2NvbmZpZ21hcC90eXBlcy50cyIsInNyYy9jb25maWdtYXAvZWRpdG9yLnRzIiwic3JjL2VkaXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWcge1xuICAgIGluY2x1c3RlcjogYm9vbGVhbjtcbiAgICBzZXJ2ZXI6IHN0cmluZztcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdENsdXN0ZXJDb25maWc6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgaW5jbHVzdGVyOiB0cnVlLFxuICAgIHNlcnZlcjogXCJodHRwczovL2FwaS5zZXJ2ZXI6ODQ0M1wiLFxuICAgIHVzZXI6IFwiY2x1c3Rlci1hZG1pblwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxufVxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNsdXN0ZXItY29uZmlnXCIsXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRDbHVzdGVyQ29uZmlnLFxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIsIENsdXN0ZXJDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWdFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZztcbn1cblxuY29uc3QgQ2x1c3RlckNvbmZpZ0VkaXRvcjogRWRpdG9yTm9kZURlZjxDbHVzdGVyQ29uZmlnRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdjb25maWcnLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjb25maWc6IHt2YWx1ZTogQ29udHJvbGxlci5kZWZhdWx0c30sXG4gICAgfSxcbiAgICBpbnB1dHM6MCxcbiAgICBvdXRwdXRzOjAsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIG9uZWRpdHNhdmU6IG9uZWRpdHNhdmUsXG4gICAgb25lZGl0cHJlcGFyZTogb25lZGl0cHJlcGFyZSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdFZGl0b3I7XG5cbmZ1bmN0aW9uIG9uZWRpdHNhdmUoKSB7XG4gICAgdGhpcy5jb25maWcgPSBDb250cm9sbGVyLmRlZmF1bHRzO1xuXG4gICAgdGhpcy5uYW1lID0gJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKClcbiAgICB0aGlzLmNvbmZpZy5zZXJ2ZXIgPSAkKFwiI25vZGUtaW5wdXQtc2VydmVyXCIpLnZhbCgpO1xuICAgIHRoaXMuY29uZmlnLmluY2x1c3RlciA9ICQoXCIjbm9kZS1pbnB1dC1pbmNsdXN0ZXJcIikuaXMoXCI6Y2hlY2tlZFwiKTtcbiAgICB0aGlzLmNvbmZpZy51c2VyID0gJChcIiNub2RlLWlucHV0LXVzZXJcIikudmFsKCk7XG4gICAgdGhpcy5jb25maWcucGFzc3dvcmQgPSAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikudmFsKCk7XG59XG5cbmZ1bmN0aW9uIG9uZWRpdHByZXBhcmUoKSB7XG4gICAgLy8gQWRkIGhvb2tzIHRvIGRpc2FibGUgZm9ybSBmaWVsZHMgd2hlbiBpbmNsdXN0ZXIgaXMgY2hlY2tlZFxuICAgIHZhciBjb250YWluZXIgPSAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpO1xuICAgIGNvbnRhaW5lci5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoXCIjbm9kZS1pbnB1dC1zZXJ2ZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXVzZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnByb3AoXCJkaXNhYmxlZFwiLCBjb250YWluZXIuaXMoXCI6Y2hlY2tlZFwiKSk7XG4gICAgfSk7XG5cbiAgICAvLyByZXN0b3JlIGZvcm0gdmFsdWVzXG4gICAgJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKHRoaXMubmFtZSlcbiAgICAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpLnByb3AoXCJjaGVja2VkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS52YWwodGhpcy5jb25maWcuc2VydmVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS52YWwodGhpcy5jb25maWcudXNlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnZhbCh0aGlzLmNvbmZpZy5wYXNzd29yZCk7XG5cbiAgICAvLyBPbiByZXN0b3JlIGRpc2FibGUgaWYgbmVlZGVkXG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikucHJvcChcImRpc2FibGVkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG59XG4iLCIvLyBUT0RPOiBXYXRjaCBpcyBub3QgaW1wbGVtZW50ZWQgeWV0XG5leHBvcnQgY29uc3QgYWN0aW9ucyA9IFtcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcImxpc3RcIiwgXCJnZXRcIiwgXCJ1cGRhdGVcIiwgXCJwYXRjaFwiXTtcblxuZXhwb3J0IGNvbnN0IENvbnRyb2xsZXIgPSB7XG4gICAgbmFtZTogXCJuYW1lc3BhY2VcIixcbiAgICBhY3Rpb25zOiBhY3Rpb25zLFxufTtcblxuIiwiaW1wb3J0IHsgRWRpdG9yTm9kZURlZiwgRWRpdG9yTm9kZVByb3BlcnRpZXMgfSBmcm9tICdub2RlLXJlZCc7XG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBDb250cm9sbGVyIGFzIENsdXN0ZXJDb25maWdDb250cm9sbGVyfSBmcm9tICcuLi9jbHVzdGVyLWNvbmZpZy90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcyBleHRlbmRzIEVkaXRvck5vZGVQcm9wZXJ0aWVzIHtcbiAgICBjbHVzdGVyOiBzdHJpbmc7XG5cbiAgICBhY3Rpb246IHN0cmluZztcbn1cblxuXG5jb25zdCBOYW1lc3BhY2VFZGl0b3I6IEVkaXRvck5vZGVEZWY8TmFtZXNwYWNlRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdrdWJlcm5ldGVzJyxcbiAgICBjb2xvcjogXCIjMzI2REU2XCIsXG4gICAgaWNvbjogXCJrdWJlcm5ldGVzX2xvZ29fNDB4NjBfd2hpdGUucG5nXCIsXG4gICAgYWxpZ246IFwibGVmdFwiLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6IHt2YWx1ZTpcIlwifSxcbiAgICAgICAgY2x1c3Rlcjoge3ZhbHVlOiBcIlwiLCB0eXBlOiBDbHVzdGVyQ29uZmlnQ29udHJvbGxlci5uYW1lLCByZXF1aXJlZDogdHJ1ZX0sXG4gICAgICAgIGFjdGlvbjoge3ZhbHVlOiBcIi1cIn0sXG4gICAgfSxcbiAgICBpbnB1dHM6MSxcbiAgICBvdXRwdXRzOjEsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxDb250cm9sbGVyLm5hbWU7XG4gICAgfSxcbiAgICBvbmVkaXRwcmVwYXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRXhhbXBsZSBob3cgdG8gYWRkIGEgbmV3IHJvdyBvbiBhY3Rpb24gc2VsZWN0aW9uIHVzaW5nIHN3aXRjaFxuICAgICAgICAvLyBzZWxlY3QgYWN0aW9uIGFuZCBzaG93L2hpZGUgdGhlIGFwcHJvcHJpYXRlIGZvcm1cbiAgICAgICAgLy8gZnVuY3Rpb24gc2VsZWN0QWN0aW9uKGV2OiBFdmVudCkge1xuICAgICAgICAvLyAgdmFyIHQgPSBldi50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7IC8vIGNvbnZlcnQgdG8gYmFzaWMgZWxlbWVudFxuICAgICAgICAvL1xuICAgICAgICAvLyAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWFjdGlvbi1jb25maWd1cmF0aW9uJylcbiAgICAgICAgLy8gICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgICAgICAvLyAgdmFyIHJvdzEgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAvLyAgKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY3JlYXRlXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQ3JlYXRlXCIpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICAvLyAgKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY3JlYXRlXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgIC8vICAgLmFwcGVuZFRvKHJvdzEpXG4gICAgICAgIC8vICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZ2xvYmFsJ119KTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIEFjdGlvbiBjb25maWcgY29udGFpbmVyXG4gICAgICAgIHZhciBjb250YWluZXIgPSAkKCcjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyJylcblxuICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1hY3Rpb25cIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJBY3Rpb25cIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eUFjdGlvbiA9ICQoJzxzZWxlY3QvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtYWN0aW9uXCIsXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byByZW5kZXIgdGhlIGNvcnJlY3QgZmllbGRzXG4gICAgICAgICAgICBvbmNoYW5nZTogZnVuY3Rpb24oZXY6IEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGV4YW1wbGUgYWJvdmVcbiAgICAgICAgICAgICAgICAvLyBhZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZWxlY3RBY3Rpb24pO1xuICAgICAgICAgICAgfX0pXG4gICAgICAgIC5hcHBlbmRUbyhyb3cxKTtcblxuICAgICAgICBDb250cm9sbGVyLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgcHJvcGVydHlBY3Rpb24uYXBwZW5kKCQoJzxvcHRpb24+Jywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBhY3Rpb24sXG4gICAgICAgICAgICAgICAgdGV4dCA6IGFjdGlvbixcbiAgICAgICAgICAgIH0pKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvcGVydHlBY3Rpb24udmFsKHRoaXMuYWN0aW9uKTtcbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmFjdGlvbiA9IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1hY3Rpb24gOnNlbGVjdGVkXCIpLnRleHQoKTtcblxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVzcGFjZUVkaXRvcjtcbiIsIi8vIFRPRE86IFdhdGNoIGlzIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbmV4cG9ydCBjb25zdCBhY3Rpb25zID0gW1wiY3JlYXRlXCIsIFwiZGVsZXRlXCIsIFwibGlzdFwiLCBcImdldFwiLCBcInVwZGF0ZVwiLCBcInBhdGNoXCJdO1xuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNvbmZpZ21hcFwiLFxuICAgIGFjdGlvbnM6IGFjdGlvbnMsXG59O1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENvbnRyb2xsZXIgYXMgQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXJ9IGZyb20gJy4uL2NsdXN0ZXItY29uZmlnL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWdNYXBFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNsdXN0ZXI6IHN0cmluZztcblxuICAgIGFjdGlvbjogc3RyaW5nO1xuICAgIG5hbWVzcGFjZTogc3RyaW5nO1xufVxuXG5cbmNvbnN0IENvbmZpZ01hcEVkaXRvcjogRWRpdG9yTm9kZURlZjxDb25maWdNYXBFZGl0b3JQcm9wZXJ0aWVzPiA9IHtcbiAgICBjYXRlZ29yeTogJ2t1YmVybmV0ZXMnLFxuICAgIGNvbG9yOiBcIiMzMjZERTZcIixcbiAgICBpY29uOiBcImt1YmVybmV0ZXNfbG9nb180MHg2MF93aGl0ZS5wbmdcIixcbiAgICBhbGlnbjogXCJsZWZ0XCIsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBuYW1lc3BhY2U6IHt2YWx1ZTpcIlwifSxcbiAgICAgICAgY2x1c3Rlcjoge3ZhbHVlOiBcIlwiLCB0eXBlOiBDbHVzdGVyQ29uZmlnQ29udHJvbGxlci5uYW1lLCByZXF1aXJlZDogdHJ1ZX0sXG4gICAgICAgIGFjdGlvbjoge3ZhbHVlOiBcIi1cIn0sXG4gICAgfSxcbiAgICBpbnB1dHM6MSxcbiAgICBvdXRwdXRzOjEsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxDb250cm9sbGVyLm5hbWU7XG4gICAgfSxcbiAgICBvbmVkaXRwcmVwYXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQWN0aW9uIGNvbmZpZyBjb250YWluZXJcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXInKVxuXG4gICAgICAgIHZhciByb3cxID0gJCgnPGRpdi8+JykuYXBwZW5kVG8oY29udGFpbmVyKTtcbiAgICAgICAgdmFyIHJvdzIgPSAkKCc8ZGl2Lz4nLHtzdHlsZTpcIm1hcmdpbi10b3A6OHB4O1wifSkuYXBwZW5kVG8oY29udGFpbmVyKTtcblxuICAgICAgICAkKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtYWN0aW9uXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQWN0aW9uXCIpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICB2YXIgcHJvcGVydHlBY3Rpb24gPSAkKCc8c2VsZWN0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LWFjdGlvblwifSlcbiAgICAgICAgICAgIC5hcHBlbmRUbyhyb3cxKTtcblxuICAgICAgICBDb250cm9sbGVyLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgcHJvcGVydHlBY3Rpb24uYXBwZW5kKCQoJzxvcHRpb24+Jywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBhY3Rpb24sXG4gICAgICAgICAgICAgICAgdGV4dCA6IGFjdGlvbixcbiAgICAgICAgICAgIH0pKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnPGxhYmVsLz4nLHtmb3I6XCJub2RlLWlucHV0LW5hbWVzcGFjZVwiLHN0eWxlOlwid2lkdGg6MTEwcHg7IG1hcmdpbi1yaWdodDoxMHB4O1wifSkudGV4dChcIk5hbWVzcGFjZVwiKS5hcHBlbmRUbyhyb3cyKTtcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZXNwYWNlID0gJCgnPGlucHV0Lz4nLHtzdHlsZTpcIndpZHRoOjI1MHB4XCIsY2xhc3M6XCJub2RlLWlucHV0LW5hbWVzcGFjZVwiLHR5cGU6XCJ0ZXh0XCJ9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHJvdzIpXG4gICAgICAgICAgICAudHlwZWRJbnB1dCh7dHlwZXM6WydzdHInXX0pO1xuXG5cbiAgICAgICAgcHJvcGVydHlOYW1lc3BhY2UudHlwZWRJbnB1dCgndmFsdWUnLCB0aGlzLm5hbWVzcGFjZSk7XG4gICAgICAgIHByb3BlcnR5QWN0aW9uLnZhbCh0aGlzLmFjdGlvbik7XG4gICAgfSxcbiAgICBvbmVkaXRzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRmluZCBjbGllbnQgc291cmNlIGRldGFpbHNcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gJChcIiNub2RlLWlucHV0LWNvbmZpZy1jb250YWluZXJcIik7XG4gICAgICAgIHZhciBub2RlID0gdGhpcztcbiAgICAgICAgbm9kZS5hY3Rpb24gPSBwcm9wZXJ0eS5maW5kKFwiLm5vZGUtaW5wdXQtYWN0aW9uIDpzZWxlY3RlZFwiKS50ZXh0KCk7XG4gICAgICAgIG5vZGUubmFtZXNwYWNlID0gcHJvcGVydHkuZmluZChcIi5ub2RlLWlucHV0LW5hbWVzcGFjZVwiKS50eXBlZElucHV0KCd2YWx1ZScpO1xuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZ01hcEVkaXRvcjtcbiIsImltcG9ydCB7IEVkaXRvclJFRCB9IGZyb20gXCJub2RlLXJlZFwiO1xuaW1wb3J0IENsdXN0ZXJDb25maWdFZGl0b3IgZnJvbSBcIi4vY2x1c3Rlci1jb25maWcvZWRpdG9yXCI7XG5pbXBvcnQgTmFtZXNwYWNlRWRpdG9yIGZyb20gXCIuL25hbWVzcGFjZS9lZGl0b3JcIjtcbmltcG9ydCBDb25maWdNYXBFZGl0b3IgZnJvbSBcIi4vY29uZmlnbWFwL2VkaXRvclwiO1xuXG5kZWNsYXJlIGNvbnN0IFJFRDogRWRpdG9yUkVEO1xuXG4vLyBmZXRjaCBkaXNjb3ZlcmVkIHR5cGVzIGZyb20gdGhlIGJhY2tlbmQsXG4vLyBhbmQgZm9yIGVhY2ggdHlwZSwgcmVnaXN0ZXIgYSBrdWJlIG5vZGUgKGkuZS4gZGVwbG95bWVudCwgbm9kZXMsIHBvZHMsIGV0Yy4gZXRjLiBpbmNsdWRpbmcgQ1JEcylcbi8vIGluIG5vZGUtcmVkXG5cbi8vIGZvciB0eXBlIDo9IHJhbmdlIGRpc2NvdmVyZWRUeXBlcyB7XG4vLyAgICAgUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcInBvZHNcIiwgUG9kc0VkaXRvcik7XG4vLyB9XG5cblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoXCJjbHVzdGVyLWNvbmZpZ1wiLCBDbHVzdGVyQ29uZmlnRWRpdG9yKVxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcIm5hbWVzcGFjZVwiLCBOYW1lc3BhY2VFZGl0b3IpXG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwiY29uZmlnbWFwXCIsIENvbmZpZ01hcEVkaXRvcilcblxuIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXIiLCJhY3Rpb25zIiwiQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7OztJQU9BLE1BQU0sb0JBQW9CLEdBQWtCO0lBQ3hDLElBQUEsU0FBUyxFQUFFLElBQUk7SUFDZixJQUFBLE1BQU0sRUFBRSx5QkFBeUI7SUFDakMsSUFBQSxJQUFJLEVBQUUsZUFBZTtJQUNyQixJQUFBLFFBQVEsRUFBRSxFQUFFO0tBQ2YsQ0FBQTtJQUVNLE1BQU1BLFlBQVUsR0FBRztJQUN0QixJQUFBLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBQSxRQUFRLEVBQUUsb0JBQW9CO0tBQ2pDOztJQ1ZELE1BQU0sbUJBQW1CLEdBQWlEO0lBQ3RFLElBQUEsUUFBUSxFQUFFLFFBQVE7SUFDbEIsSUFBQSxLQUFLLEVBQUUsU0FBUztJQUNoQixJQUFBLFFBQVEsRUFBRTtJQUNOLFFBQUEsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQztJQUNoQixRQUFBLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRUEsWUFBVSxDQUFDLFFBQVEsRUFBQztJQUN2QyxLQUFBO0lBQ0QsSUFBQSxNQUFNLEVBQUMsQ0FBQztJQUNSLElBQUEsT0FBTyxFQUFDLENBQUM7SUFDVCxJQUFBLElBQUksRUFBRSxVQUFVO0lBQ2hCLElBQUEsVUFBVSxFQUFFLFVBQVU7SUFDdEIsSUFBQSxhQUFhLEVBQUUsYUFBYTtJQUM1QixJQUFBLEtBQUssRUFBRSxZQUFBO0lBQ0gsUUFBQSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUVBLFlBQVUsQ0FBQyxJQUFJLENBQUM7U0FDckM7S0FDSixDQUFBO0lBSUQsU0FBUyxVQUFVLEdBQUE7SUFDZixJQUFBLElBQUksQ0FBQyxNQUFNLEdBQUdBLFlBQVUsQ0FBQyxRQUFRLENBQUM7UUFFbEMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FB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