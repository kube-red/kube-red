import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import { Controller } from "./types";

import * as k8s from '@kubernetes/client-node';

export interface UpsertProperties extends NodeDef {
    cluster: string;
    action: string;
}

class UpsertNode extends Node {
    cluster: string;
    action: string;
    kc: k8s.KubeConfig;

    constructor(config: UpsertProperties) {
        super(config);
        this.cluster = config.cluster;
        this.action = config.action;

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
            console.log(this.kc)
            let client = k8s.KubernetesObjectApi.makeApiClient(this.kc);

            // generic object for actions
            switch (typeof msg.payload) {
                case 'object':
                    break;
                default:
                    this.error("Invalid payload type");
            }


            var spec: k8s.KubernetesObject = msg.payload;

            spec.metadata = spec.metadata || {};
            spec.metadata.annotations = spec.metadata.annotations || {};
            delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
            spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
            try {
                // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
                // block.

                await client.read({ kind: spec.kind, apiVersion: spec.apiVersion, metadata: {name:spec.metadata.name, namespace: spec.metadata.namespace}});
                // we got the resource, so it exists, so patch it
                //
                // Note that this could fail if the spec refers to a custom resource. For custom resources you may need
                // to specify a different patch merge strategy in the content-type header.
                //
                // See: https://github.com/kubernetes/kubernetes/issues/97423
                const response = await client.patch(spec);
                this.send({payload: response.body});
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                try {
                    const response = await client.create(spec);
                    this.send({payload: response.body});
                } catch (e) {
                    this.error("Failed to upsert resource: " + e);
                }
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    UpsertNode.registerType(RED, Controller.name);
}
