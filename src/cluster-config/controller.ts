import { throws } from "assert";
import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import { message } from "gulp-typescript/release/utils";

export interface ClusterConfigProperties extends NodeDef {
    cluster: k8s.KubeConfig
}

class ClusterConfigController {
    node: Node;
    incluster: boolean;
    name: string;
    server: string;
    user: string;
    password: string;


    constructor(node: Node, RED: NodeAPI, config: ClusterConfigProperties) {
        this.node = node;
        const kc = new k8s.KubeConfig();
        if (!this.incluster) {
            const cluster = {
                name: config.name,
                server: this.server,
            };
            const user = {
                name: this.user,
                password: this.password,
            };
            const context = {
                name: config.name,
                cluster: cluster.name,
                user: user.name,
            }
            kc.loadFromOptions({
                clusters: [cluster],
                users: [user],
                contexts: [context],
                currentContext: context.name,
            });
        }
        config.cluster = kc;
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
