import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../../node";
import {Controller} from "./types";

import * as k8s from '@kubernetes/client-node';

export interface ConfigMapProperties extends NodeDef {
    cluster: string;
    action: string;
    namespace: string;
}

class ConfigMapNode extends Node {
    cluster: string;
    action: string;
    namespace: string;
    configNode: any;

    constructor(config: ConfigMapProperties) {
        super(config);
        this.cluster = config.cluster;
        this.action = config.action;
        this.namespace = config.namespace;
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
        var obj = new k8s.V1ConfigMap();
        switch (typeof msg.payload) {
            case 'string':
                switch (true) {
                    // order matters here. if we have a namespace set, use it
                    // else if the payload has a namespace, use it
                    case (this.namespace != undefined):
                        obj.metadata = new k8s.V1ObjectMeta();
                        obj.metadata.name = msg.payload;
                        obj.metadata.namespace = this.namespace;
                        break;
                    case (msg.payload.includes("/") && msg.payload.split("/").length == 2):
                        obj.metadata = new k8s.V1ObjectMeta();
                        obj.metadata.name = msg.payload.split("/")[1];
                        obj.metadata.namespace = msg.payload.split("/")[0];
                        this.namespace = obj.metadata.namespace;
                        break;
                    default:
                        this.error("Invalid namespace/name format or namespace not set");
                    return;
                }
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
                fn = k8sApi.createNamespacedConfigMap(this.namespace, obj)
                break;
            case "delete":
                fn =  k8sApi.deleteNamespacedConfigMap(obj.metadata.name, this.namespace)
                break;
            case "get":
                fn = k8sApi.readNamespacedConfigMap(obj.metadata.name, this.namespace)
                break;
            case "list":
                fn = k8sApi.listNamespacedConfigMap(this.namespace)
                break;
            case "patch":
                fn = k8sApi.patchNamespacedConfigMap(obj.metadata.name, this.namespace, obj)
                break;
            case "update":
                fn = k8sApi.replaceNamespacedConfigMap(obj.metadata.name, this.namespace, obj)
            default:
                this.error("Invalid action");
        }

        fn.then((res) => {
            this.send({payload: res.body});
        }).catch((err) => {
            this.error(JSON.stringify(err))
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    ConfigMapNode.registerType(RED, Controller.name);
}
