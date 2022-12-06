(function () {
    'use strict';

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

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("lower-case", LowerCaseEditor);

})();
