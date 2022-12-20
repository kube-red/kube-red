import { Node, RED } from "./node";
import { NodeDef, NodeAPI } from "node-red";
import nodeRedNodeTestHelper from "node-red-node-test-helper";
import { afterEach, beforeEach, describe, it } from "node:test";
import registerNamespace from "./namespace/node";
import registerConfigMap from "./configmap/node";

describe("Node", () => {
    class Foo extends Node {
        constructor(config: NodeDef) {
            super(config);
        }
    }

    it("should register", () => {
        var flow = [
            { id: "n1", type: "lower-case", name: "lc" },
            { id: "n2", type: "foo", name: "foo" },
        ];
        nodeRedNodeTestHelper.load((RED: NodeAPI) => {
            Foo.registerType(RED, "foo");
            registerNamespace(RED);
            registerConfigMap(RED);
        }, flow, () => {
            console.log(nodeRedNodeTestHelper.getNode("n1"));
            console.log(nodeRedNodeTestHelper.getNode("n2"));
        });
    })
});
