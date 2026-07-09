import dagre from "@dagrejs/dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 280;
const NODE_HEIGHT = 150;

export function getLayoutedElements(
    nodes,
    edges
){

    dagreGraph.setGraph({

        rankdir: "LR",

        align: "UL",

        ranksep: 220,

        nodesep: 120,

        edgesep: 60,

        marginx: 100,

        marginy: 80

    });

    nodes.forEach(node=>{

        dagreGraph.setNode(

            node.id,

            {

                width: NODE_WIDTH,

                height: NODE_HEIGHT

            }

        );

    });

    edges.forEach(edge=>{

        dagreGraph.setEdge(

            edge.source,

            edge.target

        );

    });

    dagre.layout(dagreGraph);

    const layoutedNodes =
    nodes.map(node=>{

        const position =
        dagreGraph.node(node.id);

        return{

            ...node,

            position:{

                x:
                position.x - NODE_WIDTH / 2,

                y:
                position.y - NODE_HEIGHT / 2

            }

        };

    });

    return{

        nodes:layoutedNodes,

        edges

    };

}