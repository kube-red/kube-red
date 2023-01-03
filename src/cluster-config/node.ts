import { NodeDef, NodeAPI } from "node-red";
import { Node } from "../node";
import * as k8s from '@kubernetes/client-node';
import { ClusterConfig, Controller } from "./types";

export interface ClusterConfigProperties extends NodeDef {
    k8s: k8s.KubeConfig;
    config: ClusterConfig;
}

class ClusterConfigNode extends Node {
    k8s: k8s.KubeConfig;
    config: ClusterConfig;

    constructor(c: ClusterConfigProperties) {
        super(c);

        const kc = new k8s.KubeConfig();
        if (c.config.incluster) {
            kc.loadFromDefault();
        } else {
            const cluster = {
                name: c.name,
                server: c.config.server,
            };

            const user = {
                name: c.config.user,
                password: c.config.password,
            };

            const context = {
                name: 'context',
                user: user.name,
                cluster: cluster.name,
            };
            kc.loadFromOptions({
                clusters: [cluster],
                users: [user],
                contexts: [context],
                currentContext: context.name,
            });
        }
        this.config = c.config;
        this.k8s = kc;
    }

}

// loaded on startup
export default function (RED: NodeAPI) {
    ClusterConfigNode.registerType(RED, Controller.name);
}
