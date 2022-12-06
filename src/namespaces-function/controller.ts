import { throws } from "assert";
import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import { message } from "gulp-typescript/release/utils";
import { ClusterConfigProperties } from "../cluster-config/controller";

export interface NamespacesProperties extends NodeDef {
    cluster: ClusterConfigProperties;
    name: string;
    labels: string[];
}

class NamespacesController {
    node: Node;
    cluster: ClusterConfigProperties;
    name: string;
    labels: string[];

    constructor(node: Node, RED: NodeAPI, config: NamespacesProperties) {
        node.on('input', this.onInput.bind(this));
        // Retrieve the config node
        var cluster = RED.nodes.getNode("cluster-config");

        this.node = node;
        this.name = config.name;
        this.labels = config.labels;
    }

    onInput(msg: NodeMessageInFlow) {
        console.log(this.cluster);
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    RED.nodes.registerType("namespaces", function(config: NamespacesProperties) {
        // called whenever a new instance of the node is created
        RED.nodes.createNode(this, config);
        new NamespacesController(this, RED, config);
    });
}
