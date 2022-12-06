import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import { ClusterConfigProperties } from "../cluster-config/controller";

export interface NamespaceProperties extends NodeDef {
    cluster: ClusterConfigProperties;
    namespacename: string;
}

class NamespaceController {
    node: Node;
    cluster: ClusterConfigProperties;
    namespacename: string;

    constructor(node: Node, RED: NodeAPI, config: NamespaceProperties) {
        node.on('input', this.onInput.bind(this));
        this.node = node;
        this.namespacename = config.namespacename;
        var confignode = RED.nodes.getNode("cluter-config");
        console.log("confignode: " + confignode);
    }

    onInput(msg: NodeMessageInFlow) {
        console.log("namespace: " + this.namespacename);
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    RED.nodes.registerType("namespace", function(config: NamespaceProperties) {
        RED.nodes.createNode(this, config);

        new NamespaceController(this, RED, config);
    });
}
