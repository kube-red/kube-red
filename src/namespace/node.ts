import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import {Controller} from "./types";

import * as k8s from '@kubernetes/client-node';

export interface NamespaceProperties extends NodeDef {
    cluster: string;
}

class NamespaceNode extends Node {
    cluster: string;
    configNode: any;

    constructor(config: NamespaceProperties) {
        super(config);
        this.cluster = config.cluster;
        this.configNode = RED.nodes.getNode(config.cluster);

        if (this.configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        this.on('input', this.onInput);
    }

    onInput(msg: NodeMessageInFlow) {
        var kc = new k8s.KubeConfig();
        kc.loadFromOptions(this.configNode.k8s);

        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        if (typeof msg.payload === 'string') {
            var namespace = new k8s.V1Namespace();
            namespace.metadata = new k8s.V1ObjectMeta();
            namespace.metadata.name = msg.payload;
        }

        k8sApi.createNamespace(namespace).then((res) => {
            this.send({payload: res.body});
        }
        ).catch((err) => {
            console.log(err)
            this.error(JSON.stringify(err))
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    NamespaceNode.registerType(RED, "namespace");
}
