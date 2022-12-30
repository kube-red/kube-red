# Design

Node design is based on the following principles:

* Each node will emit current object state in `msg.object` property.
* Each node will forward `msg.payload` to the next node as it is.
* Nodes emits core events based on node type. In example `namespace`
will emit `msg.namespace` with the name of the namespace.
* Namespaces components will will read `msg.namespace` and use it as
the namespace to operate on.

To avoid message aggregation on nodes, sending node always aggregated messages:

```javascript
// where msg: PayloadType;
msg.namespace = spec.metadata.name;
msg.object = response.body;
this.send(msg);
```

## Node types

* Generic nodes
* Component nodes

### Generic nodes

Generic nodes operate on all objects and required `kind`, `apiVersion` in the
payload for it to work. All generic nodes configuration can be override by local node configuration.
Local configuration takes priority over `msg` input.

* `upsert` - node will accept `msg.object` and will create or update(patch)
object in the cluster. It required `kind`, `apiVersion`, `name`, `namespace`.

* `getter` - node will accept `msg.object` and will get object from the cluster.
It required `kind`, `apiVersion`, `name`, `namespace` to be present in the payload.

* `deleter` (TBC) - node will accept `msg.object` and will delete object from the cluster.
It required `kind`, `apiVersion`, `name`, `namespace` to be present in the payload.

* `watcher` (TBC) - node will accept `msg.object` and will watch object in the cluster and emit
`msg.object` with the current state of the object.

### Component nodes

Component nodes operate on specific object type and required `name` and `namespace` in the
payload for it to work. All component nodes configuration can be override by local node configuration.

Nodes does `upsert` by default (createOrUpdate). Node will forward `msg.payload` as it is,
and will emit `msg.object` with the current state of the object.

Namespaced object will require `namespace` object (`msg.namespace`) to be present in the payload
connected to the node. If `namespace` is not present in the payload, node will use node configuration
value or fail.
