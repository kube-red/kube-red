# kube-red

Kube-RED bridges Kubernetes live system state and system definition into Node-RED, making integration of services instantly observable.

It discovers API types in a Kubernetes cluster and makes them available as Nodes in Node-RED for further processing.

Kube-RED turns a system specification (manifests in kube) into a realtime dynamic system, unseen in the Kubernetes ecosystem. It replaces multi-thousand-line controller code in Golang through another level of abstraction, reducing complexity dramatically and with that opens dynamic distributed system development to a new set of developers and users.

## Development

### Local

1. Install `npm`
2. Invoke `npm install`
3. Invoke `npm run server`

After running `npm run server` Node-RED will be running on ports 1880 and 3000.
You can access the development server at http://localhost:1880 or http://localhost:3000 either port can be used.
On port 3000 browser-sync is running and will reload the browser when changes are made to the editor source code.

### podman machine

Prerequisites:
-  https://podman.io/

Start podman:
```
$ podman machine init --volume /Users/$USER:/Users/$USER
```

Or on Linux

```
$ podman machine init --volume /home/$USER:/home/$USER
```

This makes your home directory available in the podman virtual machine.
This is necessary to be able to directly mount source directories inside the VM.

Next, start the development container and invoke `npm install`:

```
$ ./hack/devcontainer.sh
bash-5.1$ npm install
```
