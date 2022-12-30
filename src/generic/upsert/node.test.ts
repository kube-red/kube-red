import { NodeDef, NodeAPI } from "node-red";
import { afterEach, beforeEach, describe, it, after } from "node:test";
import register from "./node";
import registerClusterConfig from "../../cluster-config/node";
import * as k8s from '@kubernetes/client-node';
import fs from 'fs';
import PayloadType from "../../shared/types";

var crypto = require("crypto");
var helper = require("node-red-node-test-helper")

helper.init(require.resolve('node-red'));

describe('upsert Node', function () {
  var name: string
  var client: k8s.KubernetesObjectApi;

  var object: k8s.KubernetesObject;

  beforeEach(function (done) {
    if (!fs.existsSync("./kubeconfig")) {
      done("kubeconfig file not found")
    }

    helper.startServer(done);

    // random test object name
    name = crypto.randomBytes(10).toString('hex');

    // k8s client
    var kc = new k8s.KubeConfig();
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

  });


  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);

    client.delete(object).then((res) => {}).catch((err) => {});
  });

  it("should be loaded", (done) => {
    var flow = [
        { id: "n1", type: "upsert", name: "test", cluster: "cfg" },
        { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
    }, flow, function () {
      var n1 = helper.getNode("n1");
      try {
        n1.should.have.property('name', 'test');
        done();
      } catch(err) {
        done(err);
      }
    });
  })

  it('should be loaded in exported flow', function (done) {
    var flow = [
      { id:"3912a37a.c3818c", type:"upsert", cluster:"e20cf249a8b5dc64",z:"e316ac4b.c85a2", name:"test",x:240,y:320,wires: [[]]},
      { id: "e20cf249a8b5dc64", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
  ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n1 = helper.getNode("3912a37a.c3818c");
      try {
        n1.should.have.property('name', 'test');
        done();
      } catch(err) {
        done(err);
      }
    });
  });

  it('should create object', function (done) {
    var flow = [
      { id: "n1", type: "upsert", name: "test", cluster: "cfg", wires:[["n2"]] },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
      { id: "n2", type: "helper" },
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg: PayloadType) {
        try {
         let data =  msg.object;
         if (data.metadata.name == name) {
            done();
         } else{
            done("object name not match")
         }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({object: object});
    });
  });

  it('should update object', function (done) {
    var flow = [
      { id: "n1", type: "upsert", name: "test", cluster: "cfg", wires:[["n2"]] },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
      { id: "n2", type: "helper" },
    ];
    helper.load((RED: NodeAPI) => {
      register(RED);
      registerClusterConfig(RED);
  }, flow, function () {

      // create object
      client.create(object).then((res) => {}).catch((err) => {done(err)});

      let newObject = object;
      newObject.metadata.labels = {"test": "test"};

      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg: PayloadType) {
        try {
         let data =  msg.object;
         if (data.metadata.labels["test"] == "test") {
            done();
         } else{
            done("object name not match")
         }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({object: newObject});
    });
  });

});
