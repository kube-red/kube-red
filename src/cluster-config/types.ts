export interface ClusterConfig {
    sourceclustername: string;
    incluster: string;
    clustername: string;
    server: string;
    user: string;
    password: string;
}

export const Controller = {
    name: "cluster-config",
};

export default ClusterConfig;
