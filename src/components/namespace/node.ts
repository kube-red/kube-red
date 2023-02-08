import { NodeDef, NodeAPI } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";
import PayloadType from "../../shared/types";
import merge from 'lodash.merge';
import yaml from 'yaml';

import * as k8s from '@kubernetes/client-node';
import * as utils from "../../shared/status";

export interface NamespaceProperties extends NodeDef {
    cluster: string;
    name: string;
    template: string;
}

class NamespaceNode extends Node {
    cluster: string;
    name: string;
    template: string;
    kc: k8s.KubeConfig;

    constructor(config: NamespaceProperties) {
        super(config);
        this.cluster = config.cluster;
        this.name = config.name;
        this.template = config.template;

        const configNode = RED.nodes.getNode(config.cluster) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        const kc = new k8s.KubeConfig();
        kc.loadFromOptions(configNode.k8s);
        this.kc = kc;

        const client = kc.makeApiClient(k8s.CoreV1Api);

        const template =  new k8s.V1Namespace();
        template.metadata = new k8s.V1ObjectMeta();
        template.metadata.name = this.name;

        let isJSON = true;
        try { JSON.parse(this.template) } catch { isJSON = false }
        let override = new Object();
        if (isJSON) {
            override = JSON.parse(this.template);
        } else {
            override = yaml.parse(this.template);
        }

        // merge template and override
        const obj = merge(template, override);

        const func = async function(msg: PayloadType) {
            // override name if specified
            if (msg.name && msg.name !== "") {
                obj.metadata.name = msg.name;
            }

            obj.metadata.annotations = obj.metadata.annotations || {};
            delete obj.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
            obj.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(obj);
            try {
                // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
                // block.

                await client.readNamespace(obj.metadata.name);
                // we got the resource, so it exists, so patch it
                //
                // Note that this could fail if the spec refers to a custom resource. For custom resources you may need
                // to specify a different patch merge strategy in the content-type header.
                //
                // See: https://github.com/kubernetes/kubernetes/issues/97423
                const response = await client.patchNamespace(obj.metadata.name, obj, undefined, undefined, undefined, undefined, undefined, { headers: { 'Content-Type': 'application/merge-patch+json' } });
                msg.object = response.body;

                this.status(utils.getNodeStatus(msg.object));
                this.send(msg);
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                try {
                    const response = await client.createNamespace(obj);
                    msg.object = response.body

                    this.status(utils.getNodeStatus(msg.object));
                    this.send(msg);
                } catch (e) {
                    this.status(utils.getErrorStatus(e));

                    if (e.body && e.body.message) {
                        this.error(e.body && e.body.message);
                        return;
                    }
                    this.error(e);
                }
            }
        }

        this.on("input", func);
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    NamespaceNode.registerType(RED, Controller.name);
}

