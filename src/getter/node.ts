import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import { Controller } from "./types";

import * as k8s from '@kubernetes/client-node';

export interface GetterProperties extends NodeDef {
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}

class GetterNode extends Node {
    cluster: string;
    kc: k8s.KubeConfig;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;

    constructor(config: GetterProperties) {
        super(config);
        this.cluster = config.cluster;
        this.apiversion = config.apiversion;
        this.kind = config.kind;
        this.namespace = config.namespace;
        this.name = config.name;

        let configNode: any
        configNode = RED.nodes.getNode(config.cluster);
        if (configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        var kc = new k8s.KubeConfig();
        kc.loadFromOptions(configNode.k8s);
        this.kc = kc;

        this.on("input", async function(msg,send,done) {
            let client = k8s.KubernetesObjectApi.makeApiClient(this.kc);

            // generic object for actions
            switch (typeof msg.payload) {
                case 'object':
                    break;
                default:
                    this.error("Invalid payload type");
            }

            // by default we read from input payload,
            // but override with node config if not set
            var spec: k8s.KubernetesObject = msg.payload;
            if (!spec.kind) {
                spec.kind = this.kind;
            }
            if (!spec.apiVersion) {
                spec.apiVersion = this.apiversion;
            }
            spec.metadata = spec.metadata || {};
            if (!spec.metadata.namespace) {
                spec.metadata.namespace = this.namespace;
            }
            if (!spec.metadata.name) {
                spec.metadata.name = this.name
            }

            spec.metadata = spec.metadata || {};
            spec.metadata.annotations = spec.metadata.annotations || {};
            delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
            spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
            try {
                // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
                // block.
                const response = await client.read({ kind: spec.kind, apiVersion: spec.apiVersion, metadata: {name:spec.metadata.name, namespace: spec.metadata.namespace}});
                this.send({payload: response.body});
            } catch (e) {
                    this.error("Failed to upsert resource: " + e);
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    GetterNode.registerType(RED, Controller.name);
}
