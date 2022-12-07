import { throws } from "assert";
import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import { message } from "gulp-typescript/release/utils";
import ClusterConfig from './types';

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

        node.on('input', this.onInput.bind(this));

        // set configure function
        this.configure = function() {
            // iterate over each config
            this.config.forEach( function(c) {
                // construct kubeconfig and set to context for each config in node
                const kc = new k8s.KubeConfig();
                if (c.incluster == "true") {
                    kc.loadFromCluster();
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

                if (c.type == "flow") {
                    node.context().flow.set(c.typeValue,kc);
                } else if (c.type == "global") {
                    node.context().global.set(c.typeValue,kc);
                }
            });
        }

        this.configure();
    }

    onInput(msg: NodeMessageInFlow) {
        // if active is true, then configure
        if (this.active == true) {
            this.configure();
        }
    }

}

// loaded on startup
export default function (RED: NodeAPI) {
    function ClusterConfigBasicNode(config: ClusterConfigBasicProperties) {
        RED.nodes.createNode(this, config);
        new ClusterConfigBasicController(this, RED, config);
    }
    RED.nodes.registerType("cluster-config-basic", ClusterConfigBasicNode);

   /* RED.httpAdmin.post("/config/:id", RED.auth.needsPermission("config.write"), function(req,res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                configure(node);
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Config failed: "+ err.toString());
            }
        } else {
            res.sendStatus(404);
        }
    }); */
}
