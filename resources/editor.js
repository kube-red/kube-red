(function () {
    'use strict';

    const defaultClusterConfig = {
        incluster: true,
        server: "https://api.server:8443",
        user: "cluster-admin",
        password: "",
    };
    const Controller$1 = {
        name: "cluster-config",
        defaults: defaultClusterConfig,
    };

    const ClusterConfigEditor = {
        category: 'config',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            config: { value: Controller$1.defaults },
        },
        inputs: 0,
        outputs: 0,
        icon: "file.png",
        oneditsave: oneditsave,
        oneditprepare: oneditprepare,
        label: function () {
            return this.name || Controller$1.name;
        }
    };
    function oneditsave() {
        this.config = Controller$1.defaults;
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

    const LowerCaseEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            cluster: { value: "", type: Controller$1.name },
            prefix: { value: "" }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "lower-case";
        }
    };

    // TODO: Watch is not implemented yet
    const actions = ["create", "delete", "list", "get", "patch"];
    const Controller = {
        name: "namespace",
        actions: actions,
    };

    const NamespaceEditor = {
        category: 'function',
        color: '#a6bbcc',
        defaults: {
            name: { value: "" },
            cluster: { value: "", type: Controller$1.name },
            action: { value: "-" },
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || Controller.name;
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
            Controller.actions.forEach(action => {
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

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("lower-case", LowerCaseEditor);
    RED.nodes.registerType("cluster-config", ClusterConfigEditor);
    RED.nodes.registerType("namespace", NamespaceEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL2xvd2VyLWNhc2UvZWRpdG9yLnRzIiwic3JjL25hbWVzcGFjZS90eXBlcy50cyIsInNyYy9uYW1lc3BhY2UvZWRpdG9yLnRzIiwic3JjL2VkaXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWcge1xuICAgIGluY2x1c3RlcjogYm9vbGVhbjtcbiAgICBzZXJ2ZXI6IHN0cmluZztcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdENsdXN0ZXJDb25maWc6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgaW5jbHVzdGVyOiB0cnVlLFxuICAgIHNlcnZlcjogXCJodHRwczovL2FwaS5zZXJ2ZXI6ODQ0M1wiLFxuICAgIHVzZXI6IFwiY2x1c3Rlci1hZG1pblwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxufVxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNsdXN0ZXItY29uZmlnXCIsXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRDbHVzdGVyQ29uZmlnLFxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIsIENsdXN0ZXJDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWdFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZztcbn1cblxuY29uc3QgQ2x1c3RlckNvbmZpZ0VkaXRvcjogRWRpdG9yTm9kZURlZjxDbHVzdGVyQ29uZmlnRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdjb25maWcnLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjb25maWc6IHt2YWx1ZTogQ29udHJvbGxlci5kZWZhdWx0c30sXG4gICAgfSxcbiAgICBpbnB1dHM6MCxcbiAgICBvdXRwdXRzOjAsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIG9uZWRpdHNhdmU6IG9uZWRpdHNhdmUsXG4gICAgb25lZGl0cHJlcGFyZTogb25lZGl0cHJlcGFyZSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdFZGl0b3I7XG5cbmZ1bmN0aW9uIG9uZWRpdHNhdmUoKSB7XG4gICAgdGhpcy5jb25maWcgPSBDb250cm9sbGVyLmRlZmF1bHRzO1xuXG4gICAgdGhpcy5uYW1lID0gJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKClcbiAgICB0aGlzLmNvbmZpZy5zZXJ2ZXIgPSAkKFwiI25vZGUtaW5wdXQtc2VydmVyXCIpLnZhbCgpO1xuICAgIHRoaXMuY29uZmlnLmluY2x1c3RlciA9ICQoXCIjbm9kZS1pbnB1dC1pbmNsdXN0ZXJcIikuaXMoXCI6Y2hlY2tlZFwiKTtcbiAgICB0aGlzLmNvbmZpZy51c2VyID0gJChcIiNub2RlLWlucHV0LXVzZXJcIikudmFsKCk7XG4gICAgdGhpcy5jb25maWcucGFzc3dvcmQgPSAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikudmFsKCk7XG59XG5cbmZ1bmN0aW9uIG9uZWRpdHByZXBhcmUoKSB7XG4gICAgLy8gQWRkIGhvb2tzIHRvIGRpc2FibGUgZm9ybSBmaWVsZHMgd2hlbiBpbmNsdXN0ZXIgaXMgY2hlY2tlZFxuICAgIHZhciBjb250YWluZXIgPSAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpO1xuICAgIGNvbnRhaW5lci5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoXCIjbm9kZS1pbnB1dC1zZXJ2ZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXVzZXJcIikucHJvcChcImRpc2FibGVkXCIsIGNvbnRhaW5lci5pcyhcIjpjaGVja2VkXCIpKTtcbiAgICAgICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnByb3AoXCJkaXNhYmxlZFwiLCBjb250YWluZXIuaXMoXCI6Y2hlY2tlZFwiKSk7XG4gICAgfSk7XG5cbiAgICAvLyByZXN0b3JlIGZvcm0gdmFsdWVzXG4gICAgJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKHRoaXMubmFtZSlcbiAgICAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpLnByb3AoXCJjaGVja2VkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS52YWwodGhpcy5jb25maWcuc2VydmVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS52YWwodGhpcy5jb25maWcudXNlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnZhbCh0aGlzLmNvbmZpZy5wYXNzd29yZCk7XG5cbiAgICAvLyBPbiByZXN0b3JlIGRpc2FibGUgaWYgbmVlZGVkXG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS5wcm9wKFwiZGlzYWJsZWRcIiwgdGhpcy5jb25maWcuaW5jbHVzdGVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikucHJvcChcImRpc2FibGVkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG5cbn1cbiIsImltcG9ydCB7IEVkaXRvck5vZGVEZWYsIEVkaXRvck5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnbm9kZS1yZWQnO1xuaW1wb3J0ICB7Q29udHJvbGxlciBhcyBDbHVzdGVyQ29uZmlnQ29udHJvbGxlcn0gZnJvbSAnLi4vY2x1c3Rlci1jb25maWcvdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvd2VyQ2FzZUVkaXRvclByb3BlcnRpZXMgZXh0ZW5kcyBFZGl0b3JOb2RlUHJvcGVydGllcyB7XG4gICAgcHJlZml4OiBzdHJpbmc7XG4gICAgY2x1c3Rlcjogc3RyaW5nO1xufVxuXG5jb25zdCBMb3dlckNhc2VFZGl0b3I6IEVkaXRvck5vZGVEZWY8TG93ZXJDYXNlRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdmdW5jdGlvbicsXG4gICAgY29sb3I6ICcjYTZiYmNmJyxcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiB7dmFsdWU6XCJcIn0sXG4gICAgICAgIGNsdXN0ZXI6IHt2YWx1ZTogXCJcIiwgdHlwZTogQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXIubmFtZX0sXG4gICAgICAgIHByZWZpeDoge3ZhbHVlOiBcIlwifVxuICAgIH0sXG4gICAgaW5wdXRzOjEsXG4gICAgb3V0cHV0czoxLFxuICAgIGljb246IFwiZmlsZS5wbmdcIixcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fFwibG93ZXItY2FzZVwiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG93ZXJDYXNlRWRpdG9yO1xuIiwiZXhwb3J0IGludGVyZmFjZSBOYW1lc3BhY2VDb25maWcge1xuICAgIGFjdGlvbjogc3RyaW5nO1xufVxuXG4vLyBUT0RPOiBXYXRjaCBpcyBub3QgaW1wbGVtZW50ZWQgeWV0XG5leHBvcnQgY29uc3QgYWN0aW9ucyA9IFtcImNyZWF0ZVwiLCBcImRlbGV0ZVwiLCBcImxpc3RcIiwgXCJnZXRcIiwgXCJwYXRjaFwiXTtcblxuZXhwb3J0IGNvbnN0IENvbnRyb2xsZXIgPSB7XG4gICAgbmFtZTogXCJuYW1lc3BhY2VcIixcbiAgICBhY3Rpb25zOiBhY3Rpb25zLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgTmFtZXNwYWNlQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENvbnRyb2xsZXIgYXMgQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXJ9IGZyb20gJy4uL2NsdXN0ZXItY29uZmlnL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBOYW1lc3BhY2VFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNsdXN0ZXI6IHN0cmluZztcblxuICAgIGFjdGlvbjogc3RyaW5nO1xufVxuXG5cbmNvbnN0IE5hbWVzcGFjZUVkaXRvcjogRWRpdG9yTm9kZURlZjxOYW1lc3BhY2VFZGl0b3JQcm9wZXJ0aWVzPiA9IHtcbiAgICBjYXRlZ29yeTogJ2Z1bmN0aW9uJyxcbiAgICBjb2xvcjogJyNhNmJiY2MnLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6IHt2YWx1ZTpcIlwifSxcbiAgICAgICAgY2x1c3Rlcjoge3ZhbHVlOiBcIlwiLCB0eXBlOiBDbHVzdGVyQ29uZmlnQ29udHJvbGxlci5uYW1lfSxcbiAgICAgICAgYWN0aW9uOiB7dmFsdWU6IFwiLVwifSxcbiAgICB9LFxuICAgIGlucHV0czoxLFxuICAgIG91dHB1dHM6MSxcbiAgICBpY29uOiBcImZpbGUucG5nXCIsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxDb250cm9sbGVyLm5hbWU7XG4gICAgfSxcbiAgICBvbmVkaXRwcmVwYXJlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gRXhhbXBsZSBob3cgdG8gYWRkIGEgbmV3IHJvdyBvbiBhY3Rpb24gc2VsZWN0aW9uIHVzaW5nIHN3aXRjaFxuICAgICAgICAvLyBzZWxlY3QgYWN0aW9uIGFuZCBzaG93L2hpZGUgdGhlIGFwcHJvcHJpYXRlIGZvcm1cbiAgICAgICAgLy8gZnVuY3Rpb24gc2VsZWN0QWN0aW9uKGV2OiBFdmVudCkge1xuICAgICAgICAvLyAgdmFyIHQgPSBldi50YXJnZXQgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7IC8vIGNvbnZlcnQgdG8gYmFzaWMgZWxlbWVudFxuICAgICAgICAvL1xuICAgICAgICAvLyAgdmFyIGNvbnRhaW5lciA9ICQoJyNub2RlLWlucHV0LWFjdGlvbi1jb25maWd1cmF0aW9uJylcbiAgICAgICAgLy8gICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgICAgICAvLyAgdmFyIHJvdzEgPSAkKCc8ZGl2Lz4nKS5hcHBlbmRUbyhjb250YWluZXIpO1xuICAgICAgICAvLyAgKCc8bGFiZWwvPicse2ZvcjpcIm5vZGUtaW5wdXQtY3JlYXRlXCIsc3R5bGU6XCJ3aWR0aDoxMTBweDsgbWFyZ2luLXJpZ2h0OjEwcHg7XCJ9KS50ZXh0KFwiQ3JlYXRlXCIpLmFwcGVuZFRvKHJvdzEpO1xuICAgICAgICAvLyAgKCc8aW5wdXQvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtY3JlYXRlXCIsdHlwZTpcInRleHRcIn0pXG4gICAgICAgIC8vICAgLmFwcGVuZFRvKHJvdzEpXG4gICAgICAgIC8vICAgLnR5cGVkSW5wdXQoe3R5cGVzOlsnZ2xvYmFsJ119KTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIEFjdGlvbiBjb25maWcgY29udGFpbmVyXG4gICAgICAgIHZhciBjb250YWluZXIgPSAkKCcjbm9kZS1pbnB1dC1jb25maWctY29udGFpbmVyJylcblxuICAgICAgICB2YXIgcm93MSA9ICQoJzxkaXYvPicpLmFwcGVuZFRvKGNvbnRhaW5lcik7XG4gICAgICAgICQoJzxsYWJlbC8+Jyx7Zm9yOlwibm9kZS1pbnB1dC1hY3Rpb25cIixzdHlsZTpcIndpZHRoOjExMHB4OyBtYXJnaW4tcmlnaHQ6MTBweDtcIn0pLnRleHQoXCJBY3Rpb25cIikuYXBwZW5kVG8ocm93MSk7XG4gICAgICAgIHZhciBwcm9wZXJ0eUFjdGlvbiA9ICQoJzxzZWxlY3QvPicse3N0eWxlOlwid2lkdGg6MjUwcHhcIixjbGFzczpcIm5vZGUtaW5wdXQtYWN0aW9uXCIsXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciB0byByZW5kZXIgdGhlIGNvcnJlY3QgZmllbGRzXG4gICAgICAgICAgICBvbmNoYW5nZTogZnVuY3Rpb24oZXY6IEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgbGlzdGVuZXIgZm9yIGV4YW1wbGUgYWJvdmVcbiAgICAgICAgICAgICAgICAvLyBhZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZWxlY3RBY3Rpb24pO1xuICAgICAgICAgICAgfX0pXG4gICAgICAgIC5hcHBlbmRUbyhyb3cxKTtcblxuICAgICAgICBDb250cm9sbGVyLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgcHJvcGVydHlBY3Rpb24uYXBwZW5kKCQoJzxvcHRpb24+Jywge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBhY3Rpb24sXG4gICAgICAgICAgICAgICAgdGV4dCA6IGFjdGlvbixcbiAgICAgICAgICAgIH0pKS5hcHBlbmRUbyhyb3cxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJvcGVydHlBY3Rpb24udmFsKHRoaXMuYWN0aW9uKTtcbiAgICB9LFxuICAgIG9uZWRpdHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBGaW5kIGNsaWVudCBzb3VyY2UgZGV0YWlsc1xuICAgICAgICB2YXIgcHJvcGVydHkgPSAkKFwiI25vZGUtaW5wdXQtY29uZmlnLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgICAgICBub2RlLmFjdGlvbiA9IHByb3BlcnR5LmZpbmQoXCIubm9kZS1pbnB1dC1hY3Rpb24gOnNlbGVjdGVkXCIpLnRleHQoKTtcblxuICAgIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVzcGFjZUVkaXRvcjtcbiIsImltcG9ydCB7IEVkaXRvclJFRCB9IGZyb20gXCJub2RlLXJlZFwiO1xuaW1wb3J0IENsdXN0ZXJDb25maWdFZGl0b3IgZnJvbSBcIi4vY2x1c3Rlci1jb25maWcvZWRpdG9yXCI7XG5pbXBvcnQgTG93ZXJDYXNlRWRpdG9yIGZyb20gXCIuL2xvd2VyLWNhc2UvZWRpdG9yXCI7XG5pbXBvcnQgTmFtZXNwYWNlRWRpdG9yIGZyb20gXCIuL25hbWVzcGFjZS9lZGl0b3JcIjtcblxuZGVjbGFyZSBjb25zdCBSRUQ6IEVkaXRvclJFRDtcblxuLy8gZmV0Y2ggZGlzY292ZXJlZCB0eXBlcyBmcm9tIHRoZSBiYWNrZW5kLFxuLy8gYW5kIGZvciBlYWNoIHR5cGUsIHJlZ2lzdGVyIGEga3ViZSBub2RlIChpLmUuIGRlcGxveW1lbnQsIG5vZGVzLCBwb2RzLCBldGMuIGV0Yy4gaW5jbHVkaW5nIENSRHMpXG4vLyBpbiBub2RlLXJlZFxuXG4vLyBmb3IgdHlwZSA6PSByYW5nZSBkaXNjb3ZlcmVkVHlwZXMge1xuLy8gICAgIFJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoXCJwb2RzXCIsIFBvZHNFZGl0b3IpO1xuLy8gfVxuXG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwibG93ZXItY2FzZVwiLCBMb3dlckNhc2VFZGl0b3IpO1xuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcImNsdXN0ZXItY29uZmlnXCIsIENsdXN0ZXJDb25maWdFZGl0b3IpXG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwibmFtZXNwYWNlXCIsIE5hbWVzcGFjZUVkaXRvcilcbiJdLCJuYW1lcyI6WyJDb250cm9sbGVyIiwiQ2x1c3RlckNvbmZpZ0NvbnRyb2xs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