import * as k8s from "@kubernetes/client-node";

// getNodeStatus returns the status of a Kubernetes object as a string and a color
// to be used in the node-red UI. As different objects have different states, we should
// add more cases as we go.
function getNodeStatus(object: k8s.KubernetesObject) {
    let status = "unknown";
    let color = "grey";

    switch(object.kind.toLocaleLowerCase()) {
        case "namespace": {
            const obj = object as k8s.V1Namespace;
            status = obj.status.phase;
            color = "green";
            break;
        }
    }
    return {fill:color,shape:"dot",text:status};
}

// getErrorStatus returns the status of a Kubernetes object as a string and a color
// It will try parse the error message and return the status of the object.
function getErrorStatus(err: any) {
    let status = "unknown";

    if (err != undefined && err.body != undefined && err.body.message) {
        status = err.body.message;
    } else{
        status = err;
    }

    return {fill:"red",shape:"dot",text:status};
}


export { getNodeStatus, getErrorStatus };
