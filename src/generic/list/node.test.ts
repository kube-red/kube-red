import { NodeAPI } from "node-red";
import { afterEach, beforeEach, describe, it} from "node:test";
import register from "./node";
import registerClusterConfig from "../../cluster-config/node";
import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import PayloadType from "../../shared/types";

import helper = require("node-red-node-test-helper")

helper.init(require.resolve('node-red'));

describe('list Node', function () {
  let client: k8s.KubernetesObjectApi;
  let object: k8s.KubernetesObject;

  beforeEach(function (done) {
    if (!fs.existsSync("./kubeconfig")) {
      done("kubeconfig file not found")
    }

    helper.startServer(done);

    // k8s client
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    client = k8s.KubernetesObjectApi.makeApiClient(kc);

    // set test object
    object = {
      apiVersion: "v1",
      kind: "Namespace",
    }
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", (done) => {
    const flow = [
        { id: "n1", type: "list", name: "test", cluster: "cfg" },
        { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
    }, flow, function () {
      const n1 = helper.getNode("n1") as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      try {
        n1.should.have.property('name', 'test');
        done();
      } catch(err) {
        done(err);
      }
    });
  })

  it('should be loaded in exported flow', function (done) {
    const flow = [
      { id:"3912a37a.c3818c", type:"list", cluster:"e20cf249a8b5dc64",z:"e316ac4b.c85a2", name:"test",x:240,y:320,wires: [[]]},
      { id: "e20cf249a8b5dc64", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
  ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      const n1 = helper.getNode("3912a37a.c3818c") as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      try {
        n1.should.have.property('name', 'test');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  // There is some sync issues with k8s api to create namespace in async
  it('should list object', function (done) {
    const flow = [
      { id: "n1", type: "list", name: "test", cluster: "cfg", wires:[["n2"]] },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
      { id: "n2", type: "helper" },
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {

      const n2 = helper.getNode("n2") as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const n1 = helper.getNode("n1") as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      n2.on("input", function (msg: PayloadType) {
        try {
         const data = msg.object as k8s.V1NamespaceList;
         if (data.items.length > 0) {
            done();
         } else{
            done("object name not match")
         }
        } catch(err) {
          done(err);
        }
      });
      const msg: PayloadType = {object: object, payload: "test", _msgid: "test"};
      n1.receive(msg);
    });
  });

  // TODO: test not found
});
