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
  var k8sApi: k8s.CoreV1Api;

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
    k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);

    k8sApi.deleteNamespace(name).then((res) => {}).catch((err) => {});
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
    var flow = [
      { id: name+"1", type: "namespace", action:"create", name: "namespace", cluster: "cfg", wires:[[name+"2"]] },
      { id: name+"2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode(name+"2");
      var n1 = helper.getNode(name+"1");
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

  it('should get namespace', function (done) {
    var obj = new k8s.V1Namespace();
    obj.metadata = new k8s.V1ObjectMeta();
    obj.metadata.name = name;
    k8sApi.createNamespace(obj).then((res) => {}).catch((err) => {done(err)});

    var flow = [
      { id: name+"1", type: "namespace", action:"get", name: "namespace", cluster: "cfg", wires:[[name+"2"]] },
      { id: name+"2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode(name+"2");
      var n1 = helper.getNode(name+"1");
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
      n1.receive({payload: name}); // noop
    });
  });


  it('should update namespace', function (done) {
    var obj = new k8s.V1Namespace();
    obj.metadata = new k8s.V1ObjectMeta();
    obj.metadata.name = name;
    k8sApi.createNamespace(obj).then((res) => {}).catch((err) => {done(err)});

    var update = new k8s.V1Namespace();
    update.metadata = new k8s.V1ObjectMeta();
    update.metadata.name = name;
    update.metadata.annotations = {"test": "test"};

    var flow = [
      { id: name+"1", type: "namespace", action:"update", name: "namespace", cluster: "cfg", wires:[[name+"2"]] },
      { id: name+"2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode(name+"2");
      var n1 = helper.getNode(name+"1");
      n2.on("input", function (msg) {
        try {
        let data = Object.assign(new k8s.V1Namespace(), msg.payload) as k8s.V1Namespace;
        if (data.metadata.name == name && data.metadata.annotations["test"] == "test") {
            done();
        } else{
            done("namespace name not match")
        }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({payload: update});
    });
  });

  it('should delete namespace', function (done) {
    var obj = new k8s.V1Namespace();
    obj.metadata = new k8s.V1ObjectMeta();
    obj.metadata.name = name;
    k8sApi.createNamespace(obj).then((res) => {}).catch((err) => {done(err)});

    var flow = [
      { id: name+"1", type: "namespace", action:"delete", name: "namespace", cluster: "cfg", wires:[[name+"2"]] },
      { id: name+"2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode(name+"2");
      var n1 = helper.getNode(name+"1");
      n2.on("input", function (msg) {
        try {
        let data = Object.assign(new k8s.V1Namespace(), msg.payload) as k8s.V1Namespace;
        if (data.status.phase == "Terminating") {
            done();
        } else{
            done("namespace not deleting")
        }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({payload: name});
    });
  });

  it('should patch namespace', function (done) {
    var obj = new k8s.V1Namespace();
    obj.metadata = new k8s.V1ObjectMeta();
    obj.metadata.name = name;
    k8sApi.createNamespace(obj).then((res) => {}).catch((err) => {done(err)});

    var patch = new k8s.V1Namespace();
    patch.metadata = new k8s.V1ObjectMeta();
    patch.metadata.name = name;
    patch.metadata.annotations = {"test": "test"};

    var flow = [
      { id: name+"1", type: "namespace", action: "patch", name: "namespace", cluster: "cfg", wires:[[name+"2"]] },
      { id: name+"2", type: "helper" },
      { id: "cfg", type: "cluster-config", name: "cluster", "config": {"incluster": true,}},
    ];
    helper.load((RED: NodeAPI) => {
      registerNamespace(RED);
      registerClusterConfig(RED);
  }, flow, function () {
      var n2 = helper.getNode(name+"2");
      var n1 = helper.getNode(name+"1");
      n2.on("input", function (msg) {
        try {
        let data = Object.assign(new k8s.V1Namespace(), msg.payload) as k8s.V1Namespace;
        if (data.metadata.name == name && data.metadata.annotations["test"] == "test") {
            done();
        } else{
            done("namespace name not match")
        }
        } catch(err) {
          done(err);
        }
      });
      n1.receive({payload: patch});
    });
  });

});
