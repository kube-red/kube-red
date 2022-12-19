(function () {
    'use strict';

    const defaultClusterConfig = {
        incluster: true,
        server: "https://api.server:8443",
        user: "cluster-admin",
        password: "",
    };
    const Controller = {
        name: "cluster-config",
        defaults: defaultClusterConfig,
    };

    const ClusterConfigEditor = {
        category: 'config',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            config: { value: Controller.defaults },
        },
        inputs: 0,
        outputs: 0,
        icon: "file.png",
        oneditsave: Save,
        oneditprepare: Restore,
        label: function () {
            return this.name || Controller.name;
        }
    };
    function Save() {
        this.config = Controller.defaults;
        this.name = $("#node-input-name").val();
        this.config.incluster = $("#node-input-incluster").is(":checked");
        this.config.server = $("#node-input-server").val();
        this.config.user = $("#node-input-user").val();
        this.config.password = $("#node-input-password").val();
    }
    function Restore() {
        $("#node-input-name").val(this.name);
        $("#node-input-incluster").prop("checked", this.config.incluster);
        $("#node-input-server").val(this.config.server);
        $("#node-input-user").val(this.config.user);
        $("#node-input-password").val(this.config.password);
    }

    const LowerCaseEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            cluster: { value: "", type: Controller.name },
            prefix: { value: "" }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "lower-case";
        }
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("lower-case", LowerCaseEditor);
    RED.nodes.registerType("cluster-config", ClusterConfigEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvY2x1c3Rlci1jb25maWcvdHlwZXMudHMiLCJzcmMvY2x1c3Rlci1jb25maWcvZWRpdG9yLnRzIiwic3JjL2xvd2VyLWNhc2UvZWRpdG9yLnRzIiwic3JjL2VkaXRvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWcge1xuICAgIGluY2x1c3RlcjogYm9vbGVhbjtcbiAgICBzZXJ2ZXI6IHN0cmluZztcbiAgICB1c2VyOiBzdHJpbmc7XG4gICAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuY29uc3QgZGVmYXVsdENsdXN0ZXJDb25maWc6IENsdXN0ZXJDb25maWcgPSB7XG4gICAgaW5jbHVzdGVyOiB0cnVlLFxuICAgIHNlcnZlcjogXCJodHRwczovL2FwaS5zZXJ2ZXI6ODQ0M1wiLFxuICAgIHVzZXI6IFwiY2x1c3Rlci1hZG1pblwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxufVxuXG5leHBvcnQgY29uc3QgQ29udHJvbGxlciA9IHtcbiAgICBuYW1lOiBcImNsdXN0ZXItY29uZmlnXCIsXG4gICAgZGVmYXVsdHM6IGRlZmF1bHRDbHVzdGVyQ29uZmlnLFxufVxuXG5leHBvcnQgZGVmYXVsdCBDbHVzdGVyQ29uZmlnO1xuXG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCB7IENvbnRyb2xsZXIsIENsdXN0ZXJDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJDb25maWdFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIGNvbmZpZzogQ2x1c3RlckNvbmZpZztcbn1cblxuY29uc3QgQ2x1c3RlckNvbmZpZ0VkaXRvcjogRWRpdG9yTm9kZURlZjxDbHVzdGVyQ29uZmlnRWRpdG9yUHJvcGVydGllcz4gPSB7XG4gICAgY2F0ZWdvcnk6ICdjb25maWcnLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjb25maWc6IHt2YWx1ZTogQ29udHJvbGxlci5kZWZhdWx0c30sXG4gICAgfSxcbiAgICBpbnB1dHM6MCxcbiAgICBvdXRwdXRzOjAsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIG9uZWRpdHNhdmU6IFNhdmUsXG4gICAgb25lZGl0cHJlcGFyZTogUmVzdG9yZSxcbiAgICBsYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWV8fENvbnRyb2xsZXIubmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsdXN0ZXJDb25maWdFZGl0b3I7XG5cbmZ1bmN0aW9uIFNhdmUoKSB7XG4gICAgdGhpcy5jb25maWcgPSBDb250cm9sbGVyLmRlZmF1bHRzO1xuXG4gICAgdGhpcy5uYW1lID0gJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKClcbiAgICB0aGlzLmNvbmZpZy5pbmNsdXN0ZXIgPSAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpLmlzKFwiOmNoZWNrZWRcIik7XG4gICAgdGhpcy5jb25maWcuc2VydmVyID0gJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS52YWwoKTtcbiAgICB0aGlzLmNvbmZpZy51c2VyID0gJChcIiNub2RlLWlucHV0LXVzZXJcIikudmFsKCk7XG4gICAgdGhpcy5jb25maWcucGFzc3dvcmQgPSAkKFwiI25vZGUtaW5wdXQtcGFzc3dvcmRcIikudmFsKCk7XG59XG5cbmZ1bmN0aW9uIFJlc3RvcmUoKSB7XG4gICAgJChcIiNub2RlLWlucHV0LW5hbWVcIikudmFsKHRoaXMubmFtZSlcbiAgICAkKFwiI25vZGUtaW5wdXQtaW5jbHVzdGVyXCIpLnByb3AoXCJjaGVja2VkXCIsIHRoaXMuY29uZmlnLmluY2x1c3Rlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXNlcnZlclwiKS52YWwodGhpcy5jb25maWcuc2VydmVyKTtcbiAgICAkKFwiI25vZGUtaW5wdXQtdXNlclwiKS52YWwodGhpcy5jb25maWcudXNlcik7XG4gICAgJChcIiNub2RlLWlucHV0LXBhc3N3b3JkXCIpLnZhbCh0aGlzLmNvbmZpZy5wYXNzd29yZCk7XG59XG4iLCJpbXBvcnQgeyBFZGl0b3JOb2RlRGVmLCBFZGl0b3JOb2RlUHJvcGVydGllcyB9IGZyb20gJ25vZGUtcmVkJztcbmltcG9ydCAge0NvbnRyb2xsZXIgYXMgQ2x1c3RlckNvbmZpZ0NvbnRyb2xsZXJ9IGZyb20gJy4uL2NsdXN0ZXItY29uZmlnL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBMb3dlckNhc2VFZGl0b3JQcm9wZXJ0aWVzIGV4dGVuZHMgRWRpdG9yTm9kZVByb3BlcnRpZXMge1xuICAgIHByZWZpeDogc3RyaW5nO1xuICAgIGNsdXN0ZXI6IHN0cmluZztcbn1cblxuY29uc3QgTG93ZXJDYXNlRWRpdG9yOiBFZGl0b3JOb2RlRGVmPExvd2VyQ2FzZUVkaXRvclByb3BlcnRpZXM+ID0ge1xuICAgIGNhdGVnb3J5OiAnZnVuY3Rpb24nLFxuICAgIGNvbG9yOiAnI2E2YmJjZicsXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgbmFtZToge3ZhbHVlOlwiXCJ9LFxuICAgICAgICBjbHVzdGVyOiB7dmFsdWU6IFwiXCIsIHR5cGU6IENsdXN0ZXJDb25maWdDb250cm9sbGVyLm5hbWV9LFxuICAgICAgICBwcmVmaXg6IHt2YWx1ZTogXCJcIn1cbiAgICB9LFxuICAgIGlucHV0czoxLFxuICAgIG91dHB1dHM6MSxcbiAgICBpY29uOiBcImZpbGUucG5nXCIsXG4gICAgbGFiZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lfHxcImxvd2VyLWNhc2VcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvd2VyQ2FzZUVkaXRvcjtcbiIsImltcG9ydCB7IEVkaXRvclJFRCB9IGZyb20gXCJub2RlLXJlZFwiO1xuaW1wb3J0IENsdXN0ZXJDb25maWdFZGl0b3IgZnJvbSBcIi4vY2x1c3Rlci1jb25maWcvZWRpdG9yXCI7XG5pbXBvcnQgTG93ZXJDYXNlRWRpdG9yIGZyb20gXCIuL2xvd2VyLWNhc2UvZWRpdG9yXCI7XG5cbmRlY2xhcmUgY29uc3QgUkVEOiBFZGl0b3JSRUQ7XG5cbi8vIGZldGNoIGRpc2NvdmVyZWQgdHlwZXMgZnJvbSB0aGUgYmFja2VuZCxcbi8vIGFuZCBmb3IgZWFjaCB0eXBlLCByZWdpc3RlciBhIGt1YmUgbm9kZSAoaS5lLiBkZXBsb3ltZW50LCBub2RlcywgcG9kcywgZXRjLiBldGMuIGluY2x1ZGluZyBDUkRzKVxuLy8gaW4gbm9kZS1yZWRcblxuLy8gZm9yIHR5cGUgOj0gcmFuZ2UgZGlzY292ZXJlZFR5cGVzIHtcbi8vICAgICBSRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwicG9kc1wiLCBQb2RzRWRpdG9yKTtcbi8vIH1cblxuUkVELm5vZGVzLnJlZ2lzdGVyVHlwZShcImxvd2VyLWNhc2VcIiwgTG93ZXJDYXNlRWRpdG9yKTtcblJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoXCJjbHVzdGVyLWNvbmZpZ1wiLCBDbHVzdGVyQ29uZmlnRWRpdG9yKVxuIl0sIm5hbWVzIjpbIkNsdXN0ZXJDb25maWdDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7SUFPQSxNQUFNLG9CQUFvQixHQUFrQjtJQUN4QyxJQUFBLFNBQVMsRUFBRSxJQUFJO0lBQ2YsSUFBQSxNQUFNLEVBQUUseUJBQXlCO0lBQ2pDLElBQUEsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBQSxRQUFRLEVBQUUsRUFBRTtLQUNmLENBQUE7SUFFTSxNQUFNLFVBQVUsR0FBRztJQUN0QixJQUFBLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBQSxRQUFRLEVBQUUsb0JBQW9CO0tBQ2pDOztJQ1ZELE1BQU0sbUJBQW1CLEdBQWlEO0lBQ3RFLElBQUEsUUFBUSxFQUFFLFFBQVE7SUFDbEIsSUFB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