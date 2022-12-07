import { throws } from "assert";
import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import { message } from "gulp-typescript/release/utils";
import ClusterConfig from './types';

export interface ClusterConfigProperties extends NodeDef {
    config : ClusterConfig[];
}

class ClusterConfigController {
    node: Node;
    config: ClusterConfig[];


    constructor(node: Node, RED: NodeAPI, config: ClusterConfigProperties) {
        node = this.node;
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    function ClusterConfigNode(config: ClusterConfigProperties) {
        RED.nodes.createNode(this, config);
        new ClusterConfigController(this, RED, config);
    }
    RED.nodes.registerType("cluster-config", ClusterConfigNode);
}
