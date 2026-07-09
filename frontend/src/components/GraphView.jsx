import {

    useEffect,
    useMemo,
    useCallback,
    useState,
    useRef

}
from "react";

import ReactFlow, {

    Background,
    Controls,
    MarkerType,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider

}
from "reactflow";

import {

    Boxes,
    Maximize2,
    Minimize2,
    RotateCcw,
    Search,
    X

}
from "lucide-react";

import "reactflow/dist/style.css";

import {

    getLayoutedElements

}
from "../utils/graphLayout";

import ServiceNode
from "./ServiceNode";

function GraphCanvas({

    nodes,
    edges,
    selectedService,
    onSelectService,
    highlightedServices = [],
    highlightedEdges = [],
    onResetAnalysis

}){

    const reactFlow =
    useReactFlow();

    const [

        isFullscreen,
        setIsFullscreen

    ] = useState(false);
    const [

        search,

        setSearch

    ] = useState("");

    const searchInput =
    useRef(null);

    const [

        flowNodes,
        setFlowNodes,
        onNodesChange

    ] = useNodesState([]);

    const [

        flowEdges,
        setFlowEdges,
        onEdgesChange

    ] = useEdgesState([]);

    const nodeTypes =
    useMemo(

        ()=>({

            service:
            ServiceNode

        }),

        []

    );

    useEffect(()=>{

        const layoutedGraph =

        getLayoutedElements(

            nodes,
            edges

        );

         setFlowNodes(

            layoutedGraph.nodes.map(

                node=>{

                    const matched =

                        search.trim()===""

                        ||

                        node.data.label

                            .toLowerCase()

                            .includes(

                                search.toLowerCase()

                            );

                    const isSelected =

                        String(selectedService?.id)===String(node.id);

                    const isImpacted =

                    highlightedServices.some(

                        id => Number(id)===Number(node.id)

                    );

                    return{

                        ...node,

                        selected:isSelected,

                        data:{

                            ...node.data,

                            impacted:isImpacted

                        },

                        style:{

                            ...node.style,

                            opacity:

                                matched

                                ?

                                (

                                    highlightedServices.length===0

                                    ||

                                    isSelected

                                    ||

                                    isImpacted

                                    ?

                                    1

                                    :

                                    0.25

                                )

                                :

                                0.08

                        }

                    };

                }

            )

        );
        console.log("Highlighted Edges:", highlightedEdges);

        console.log("Graph Edges:", layoutedGraph.edges);

        setFlowEdges(

            layoutedGraph.edges.map(

                edge=>{

                    const highlighted =

                        highlightedEdges.includes(

                            edge.id

                        );

                    return{

                        ...edge,

                        type:"straight",

                        animated:highlighted,

                        markerEnd:{

                            type:
                            MarkerType.ArrowClosed,

                            width:20,

                            height:20,

                            color:

                                highlighted

                                ?

                                "#ef4444"

                                :

                                "#64748b"

                        },

                        style:{

                            stroke:

                                highlighted

                                ?

                                "#ef4444"

                                :

                                "#3f3f46",

                            strokeWidth:

                                highlighted

                                ?

                                4

                                :

                                2,

                            opacity:

                                highlighted

                                ?

                                1

                                :

                                0.35

                        }

                    };

                }

            )

        );

    },[

        nodes,
        edges,
        selectedService,
        search,
        highlightedServices,
        highlightedEdges

    ]);

    const fitGraph =
    useCallback(()=>{

        reactFlow.fitView({

            duration:600,

            padding:0.18,

            maxZoom:1.2

        });

    },[reactFlow]);
    
        useEffect(()=>{

        if(

            search.trim()===""

        ){

            return;

        }

        const matchedNode =

            flowNodes.find(

                node=>

                    node.data.label

                        .toLowerCase()

                        .includes(

                            search.toLowerCase()

                        )

            );

        if(!matchedNode){

            return;

        }

        reactFlow.setCenter(

            matchedNode.position.x + 140,

            matchedNode.position.y + 70,

            {

                zoom:1.2,

                duration:700

            }

        );

    },[

        search,
        flowNodes,
        reactFlow

    ]);

    useEffect(()=>{

    function handleKeyDown(

        event

    ){

        if(

            event.key==="Escape"

        ){

            setSearch("");

        }

    }

    window.addEventListener(

        "keydown",

        handleKeyDown

    );

    return()=>{

        window.removeEventListener(

            "keydown",

            handleKeyDown

        );

    };

},[]);




    function toggleFullscreen(){

        setIsFullscreen(

            previous=>!previous

        );

        setTimeout(()=>{

            reactFlow.fitView({

                duration:500,

                padding:0.15,

                maxZoom:1.2

            });

        },250);

    }

    function handleNodeClick(

        _,
        node

    ){

        onSelectService(

            node

        );

    }
        return(

        <div

            className={

                `

                ${

                    isFullscreen

                    ?

                    "fixed inset-4 z-50"

                    :

                    "h-[75vh]"

                }

                rounded-2xl
                border
                border-zinc-800
                bg-zinc-950
                overflow-hidden
                flex
                flex-col
                shadow-2xl

                `

            }

        >

            {/* Header */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-800
                    bg-zinc-950
                    px-5
                    py-4
                "
            >

                <div>

                   <div>

            <h2
                className="
                    flex
                    items-center
                    gap-2
                    text-lg
                    font-semibold
                "
            >

                <Boxes
                    size={18}
                    className="text-cyan-400"
                />

                Service Dependency Graph

            </h2>

            <div
                className="
                    mt-2
                    flex
                    items-center
                    gap-5
                    text-[11px]
                    text-zinc-400
                "
            >

                <span>

                    {nodes.length} Services • {edges.length} Dependencies

                </span>

                <div className="flex items-center gap-1.5">

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-cyan-500
                        "
                    />

                    Selected

                </div>

                <div className="flex items-center gap-1.5">

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-red-500
                        "
                    />

                    Impacted

                </div>

                <div className="flex items-center gap-1.5">

                    <span
                        className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-zinc-500
                        "
                    />

                    Normal

                </div>

                <div className="flex items-center gap-2">

                    <div
                        className="
                            h-[2px]
                            w-6
                            bg-red-500
                        "
                    />

                    Impact Path

                </div>

            </div>

        </div>
        

            <div

        className="
            mt-4
            relative
            w-80
        "

    >

        <Search

            size={16}

            className="
                absolute
                left-3
                top-3
                text-zinc-500
            "

        />

        <input

            ref={searchInput}

            value={search}

            onChange={(event)=>{

                setSearch(

                    event.target.value

                );

            }}

            placeholder="Search service..."

            className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                py-2.5
                pl-10
                pr-10
                text-sm
                outline-none
                transition
                focus:border-cyan-500
            "

        />

        {

            search &&

            (

                <button

                    onClick={()=>{

                    setSearch("");

                    fitGraph();

                    searchInput.current?.focus();

                }}

                    className="
                        absolute
                        right-3
                        top-2.5
                        text-zinc-500
                        hover:text-white
                    "

                >

                    <X size={16}/>

                </button>

            )

        }

    </div>

                  

                </div>

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button

                onClick={fitGraph}

                className="
                    rounded-lg
                    border
                    border-zinc-700
                    bg-zinc-900
                    px-4
                    py-2
                    text-sm
                    transition
                    hover:border-cyan-500
                    hover:text-cyan-400
                "

            >

                Fit Graph

            </button>

            <button

                onClick={onResetAnalysis}

                disabled={highlightedServices.length===0}

                title="Reset Analysis"

                className={`
                    rounded-lg
                    border
                    p-2
                    transition

                    ${

                        highlightedServices.length===0

                        ?

                        "cursor-not-allowed border-zinc-800 text-zinc-600"

                        :

                        "border-zinc-700 bg-zinc-900 hover:border-red-500 hover:text-red-400"

                    }

                `}

            >

                <RotateCcw size={18}/>

            </button>

            <button

                onClick={toggleFullscreen}

                className="
                    rounded-lg
                    border
                    border-zinc-700
                    bg-zinc-900
                    p-2
                    transition
                    hover:border-cyan-500
                    hover:text-cyan-400
                "

            >

                {

                    isFullscreen

                    ?

                    <Minimize2 size={18}/>

                    :

                    <Maximize2 size={18}/>

                }

            </button>

                </div>

            </div>

            {/* React Flow */}

            <div
                className={

                    isFullscreen

                    ?

                    "flex-1 h-full"

                    :

                    "flex-1"

                }
            >

                <ReactFlow

                    nodes={flowNodes}

                    edges={flowEdges}

                    nodeTypes={nodeTypes}

                    onNodesChange={onNodesChange}

                    onEdgesChange={onEdgesChange}

                    onNodeClick={handleNodeClick}

                    fitView

                    fitViewOptions={{

                        padding:0.18

                    }}

                    proOptions={{

                        hideAttribution:true

                    }}

                    nodesDraggable={false}

                    nodesConnectable={false}

                    elementsSelectable={true}

                    panOnDrag

                    panOnScroll

                    zoomOnScroll

                    zoomOnPinch

                    zoomOnDoubleClick={false}

                    minZoom={0.4}

                    maxZoom={2}

                    defaultViewport={{

                        x:0,

                        y:0,

                        zoom:1

                    }}

                >

                    <Background

                        gap={36}

                        size={1.2}

                        color="#27272a"

                    />

                    <Controls

                        position="top-right"

                        showInteractive={false}

                    />
                    
                    </ReactFlow>

            </div>

        </div>

    );

}

function GraphView(props){

    return(

        <ReactFlowProvider>

            <GraphCanvas

                {...props}

            />

        </ReactFlowProvider>

    );

}

export default GraphView;