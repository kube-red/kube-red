import { NodeDef, NodeAPI } from "node-red";
import { afterEach, beforeEach, describe, it } from "node:test";
import registerNamespace from "./node";
import registerClusterConfig from "../cluster-config/node";
import * as k8s from '@kubernetes/client-node';
import fs from 'fs';


var crypto = require("crypto");
var helper = require("node-red-node-test-helper")

helper.init(require.resolve('node-red'));

describe('namespace Node', function () {

  var name: string

  beforeEach(function (done) {
    if (!fs.existsSync("./kubeconfig")) {
      done("kubeconfig file not found")
    }

    helper.startServer(done);

    name = crypto.randomBytes(10).toString('hex');
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", (done) => {
    var flow = [
        { id: "n1", type: "namespace", name: "nc" },
    ];
    helper.load((RED: NodeAPI) => {
        registerNamespace(RED);
    }, flow, function () {
      var n1 = helper.getNode("n1");
      try {
        n1.should.have.property('name', 'nc');
        done();
      } catch(err) {
        done(err);
      }
    });
  })
  it('should be loaded in exported flow', function (done) {
    var flow = [
      {"id":"3912a37a.c3818c","type":"namespace", "cluster":"e20cf249a8b5dc64","z":"e316ac4b.c85a2","name":"namespace","x":240,"y":320,"wires":[[]]},
  ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
  }, flow, function () {
      var n1 = helper.getNode("3912a37a.c3818c");
      try {
        n1.should.have.property('name', 'namespace');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  it('should create namespace', function (done) {
    // n1(cfg)-->n2
    var flow = [
      { id: "n1", type: "namespace", action:"create", name: "namespace", cluster: "cfg", wires:[["n2"]] },
      { id: "n2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
         let data = Object.assign(new k8s.V1Namespace(), msg.payload) as k8s.V1Namespace;
         if (data.metadata.name == name) {
            done();
         } else{
            done("namespace name not match")
         }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({payload: name});
    });
  });

});
