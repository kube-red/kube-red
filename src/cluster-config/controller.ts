import { throws } from "assert";
import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import {ClusterConfig, Controller} from './types';

export interface ClusterConfigBasicProperties extends NodeDef {
    name: string;
    active: boolean;
    config: ClusterConfig[];
}

class ClusterConfigBasicController {
    node: Node;
    name: string;
    active: boolean;
    config: ClusterConfig[];

    configure: Function;

    constructor(node: Node, RED: NodeAPI, config: ClusterConfigBasicProperties) {
        // set incoming node to this.node
        this.node = node;
        // set incoming config to this.config
        this.config = config.config;
        this.active = config.active;

        // set configure function
        this.configure = function() {
            // iterate over each config
            this.config.forEach( function(c: ClusterConfig) {
                // construct kubeconfig and set to context for each config in node
                var kc = new k8s.KubeConfig();
                if (c.incluster == "true") {
                    kc.loadFromDefault();
                } else {
                    const cluster = {
                        name: c.clustername,
                        server: c.server,
                    };

                    const user = {
                        name: c.user,
                        password: c.password,
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
                console.log("Setting context for " + c.sourceclustername + " to " + kc);
                node.context().global.set(c.sourceclustername,kc);
            });
        }

        this.configure();
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    function ClusterConfigBasicNode(config: ClusterConfigBasicProperties) {
        RED.nodes.createNode(this, config);
        new ClusterConfigBasicController(this, RED, config);
    }
    RED.nodes.registerType(Controller.name, ClusterConfigBasicNode);
}
