import { NodeAPI } from "node-red";
import { afterEach, beforeEach, describe, it } from "node:test";
import register from "./node";
import registerClusterConfig from "../../cluster-config/node";
import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import PayloadType from "../../shared/types";

import crypto = require("crypto");
import helper = require("node-red-node-test-helper")

helper.init(require.resolve('node-red'));

describe('delete Node', function () {
  let name: string
  let client: k8s.KubernetesObjectApi;

  let object: k8s.KubernetesObject;

  beforeEach(function (done) {
    if (!fs.existsSync("./kubeconfig")) {
      done("kubeconfig file not found")
    }

    helper.startServer(done);

    // random test object name
    name = crypto.randomBytes(10).toString('hex');

    // k8s client
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    client = k8s.KubernetesObjectApi.makeApiClient(kc);

    // set test object
    object = {
      apiVersion: "v1",
      kind: "Namespace",
      metadata: {
        name: name,
      },
    }

    client.create(object)

  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);

    client.delete(object)
  });

  it("should be loaded", (done) => {
    const flow = [
        { id: "n1", type: "delete", name: "test", cluster: "cfg" },
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
      { id:"3912a37a.c3818c", type:"delete", cluster:"e20cf249a8b5dc64",z:"e316ac4b.c85a2", name:"test",x:240,y:320,wires: [[]]},
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


  it('should delete object', function (done) {
    const flow = [
      { id: "n1", type: "delete", name: "test", cluster: "cfg", wires:[["n2"]] },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
      { id: "n2", type: "helper" },
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {

      const n2 = helper.getNode("n2");
      const n1 = helper.getNode("n1");
      n2.on("input", function (msg: PayloadType) {
        try {
         const data =  msg.object as k8s.V1Status;
         if (data.status["phase"] == 'Terminating') {
            done();
         } else{
            done("object status not match")
         }
        } catch(err) {
          done(err);
        }
      });
      const msg: PayloadType = {object: object, _msgid: "test"};
      n1.receive(msg);
    });
  });

  // TODO: test not found
});
