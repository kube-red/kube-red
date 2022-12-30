import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import { Controller } from "./types";
import PayloadType from "../shared/types";

import * as k8s from '@kubernetes/client-node';


export interface NamespaceProperties extends NodeDef {
    cluster: string;
    name: string;
}

class NamespaceNode extends Node {
    cluster: string;
    kc: k8s.KubeConfig;
    name: string;

    constructor(config: NamespaceProperties) {
        super(config);
        this.cluster = config.cluster;
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

        this.on("input", async function(msg: PayloadType,send,done) {
            let client = k8s.KubernetesObjectApi.makeApiClient(this.kc);
            let spec: k8s.KubernetesObject = {};

            spec = msg.object || {};
            spec.metadata = spec.metadata || {};
            spec.kind = "Namespace";
            spec.apiVersion = "v1";

            if (!spec.metadata.name) {
                spec.metadata.name = this.name
            }

            spec.metadata.annotations = spec.metadata.annotations || {};
            delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
            spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
            try {
                await client.read({ kind: spec.kind, apiVersion: spec.apiVersion, metadata: {name:spec.metadata.name, namespace: spec.metadata.namespace}});
                // we got the resource, so it exists, so patch it
                //
                // Note that this could fail if the spec refers to a custom resource. For custom resources you may need
                // to specify a different patch merge strategy in the content-type header.
                //
                // See: https://github.com/kubernetes/kubernetes/issues/97423
                const response = await client.patch(spec);
                msg.namespace = spec.metadata.name;
                msg.object = response.body
                this.send(msg)
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                try {
                    const response = await client.create(spec);
                    msg.namespace = spec.metadata.name;
                    msg.object = response.body
                    this.send(msg)
                } catch (e) {
                    this.error("Failed to upsert resource: " + e);
                }
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    NamespaceNode.registerType(RED, Controller.name);
}
