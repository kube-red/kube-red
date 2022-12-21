import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import {Controller} from "./types";

import * as k8s from '@kubernetes/client-node';

export interface NamespaceProperties extends NodeDef {
    cluster: string;
    action: string;
}

class NamespaceNode extends Node {
    cluster: string;
    action: string;
    configNode: any;

    constructor(config: NamespaceProperties) {
        super(config);
        this.cluster = config.cluster;
        this.action = config.action;
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

        // generic object for actions
        var obj = new k8s.V1Namespace();
        switch (typeof msg.payload) {
            case 'string':
                obj.metadata = new k8s.V1ObjectMeta();
                obj.metadata.name = msg.payload;
                break;
            case 'object':
                obj = msg.payload;
                break;
            default:
                this.error("Invalid payload type");
        }

        // switch based on action
        let fn = null;
        switch (this.action) {
            case "create":
                fn = k8sApi.createNamespace(obj)
                break;
            case "delete":
                fn =  k8sApi.deleteNamespace(obj.metadata.name)
                break;
            case "get":
                fn = k8sApi.readNamespace(obj.metadata.name)
                break;
            case "list":
                fn = k8sApi.listNamespace()
                break;
            case "patch":
                fn = k8sApi.patchNamespace(obj.metadata.name, obj, undefined, undefined, undefined, undefined, undefined,
                    { headers: { "Content-Type": "application/merge-patch+json" } })
                break;
            case "update":
                fn = k8sApi.replaceNamespace(obj.metadata.name, obj)
                break;
            default:
                this.error("Invalid action");
        }

        fn.then((res) => {
            this.send({payload: res.body});
        }).catch((err) => {
            this.error(err);
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    NamespaceNode.registerType(RED, Controller.name);
}
