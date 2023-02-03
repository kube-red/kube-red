# Components

Component nodes are dedicated blocks for individual components.
Each component by default is `upsert` and accepts predefined set of inputs, specific
to the component type.

## Namespace

Inputs:
* `msg.payload` - triggers the component
* `msg.name` - name of the component. Overrides the name from the node configuration

Outputs:
* `msg.object` - object of the component


# Roadmap

* [ ] Add support for `namespace`, `service`, `configmap`, `secret`, `persistentvolumeclaim`, `persistenvolume` and `deployment` components
* [ ] Investigate dynamic component creation using openapi spec
