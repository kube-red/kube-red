import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import NamespaceConfig from "./types";
export interface NamespaceProperties extends NodeDef {
    config: NamespaceConfig;
}

class NamespaceController {
    node: Node;
    config: NamespaceConfig;
    kc: k8s.KubeConfig;

    constructor(node: Node, RED: NodeAPI, config: NamespaceProperties) {
        this.node = node;
        this.config = config.config;

        node.on('input', this.onInput.bind(this));
    }

    onInput(msg: NodeMessageInFlow) {
        console.log(this.config);
        var kc = this.node.context().global.get("kubeconfig")
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    RED.nodes.registerType("namespace", function(config: NamespaceProperties) {
        RED.nodes.createNode(this, config);

        new NamespaceController(this, RED, config);
    });
}
