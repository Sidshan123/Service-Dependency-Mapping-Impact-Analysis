import {

    Handle,
    Position

}
from "reactflow";

import {

    Tag

}
from "lucide-react";

function ServiceNode({

    data,
    selected

}){

    //--------------------------------------------------
    // STATUS STYLE
    //--------------------------------------------------

    function getStatusStyle(status){

        switch(status){

            case "ACTIVE":

                return{

                    dot:"bg-green-500",

                    badge:"bg-green-500/10 text-green-400"

                };

            case "ROOT":

                return{

                    dot:"bg-cyan-500",

                    badge:"bg-cyan-500/10 text-cyan-400"

                };

            case "IMPACTED":

                return{

                    dot:"bg-orange-500",

                    badge:"bg-orange-500/10 text-orange-400"

                };

            case "DOWN":

                return{

                    dot:"bg-red-500",

                    badge:"bg-red-500/10 text-red-400"

                };

            case "MAINTENANCE":

                return{

                    dot:"bg-yellow-500",

                    badge:"bg-yellow-500/10 text-yellow-400"

                };

            default:

                return{

                    dot:"bg-gray-500",

                    badge:"bg-zinc-700 text-zinc-300"

                };

        }

    }

    //--------------------------------------------------
    // DOMAIN BADGE STYLE
    //--------------------------------------------------

    function getDomainBadgeStyle(domainName){

        if(!domainName){

            return{

                background:"#3f3f46",

                color:"#d4d4d8",

                border:"#52525b"

            };

        }

        let hash = 0;

        for(

            let i = 0;

            i < domainName.length;

            i++

        ){

            hash =

                domainName.charCodeAt(i)

                +

                ((hash << 5) - hash);

        }

        const hue =

            Math.abs(hash) % 360;

        return{

            background:`hsla(${hue},80%,50%,0.22)`,

            color:`hsl(${hue},90%,75%)`,

            border:`hsla(${hue},90%,60%,0.55)`

        };

    }

    //--------------------------------------------------
    // NODE STATE
    //--------------------------------------------------

    const isSelected =
    selected;

    const isImpacted =
    data.impacted;

    const displayStatus =

        isSelected

        ?

        "ROOT"

        :

        isImpacted

        ?

        "IMPACTED"

        :

        data.status;

    const status =

        getStatusStyle(

            displayStatus

        );

    const domainStyle =

        getDomainBadgeStyle(

            data.domain_name

        );

    //--------------------------------------------------
    // UI
    //--------------------------------------------------

    return(

        <div

            className={`
                relative
                w-[280px]
                rounded-2xl
                border
                transition-all
                duration-300

                ${

                    isSelected

                    ?

                    "border-cyan-500 bg-cyan-500/5 shadow-xl shadow-cyan-500/30"

                    :

                    isImpacted

                    ?

                    "border-orange-500 bg-orange-500/5 shadow-xl shadow-orange-500/25"

                    :

                    "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:-translate-y-1 hover:shadow-lg"

                }

            `}

        >

            {/* LEFT ACCENT */}

            <div

                className={`
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1.5
                    rounded-l-2xl

                    ${

                        isSelected

                        ?

                        "bg-cyan-500"

                        :

                        isImpacted

                        ?

                        "bg-orange-500"

                        :

                        "bg-zinc-700"

                    }

                `}

            />

            <Handle

                type="target"

                position={Position.Left}

                style={{

                    width:6,

                    height:6,

                    background:"#52525b",

                    border:"none"

                }}

            />

            <div

                className="

                    px-6
                    py-5

                "

            >

                <h3

                    className="

                        break-words
                        text-base
                        font-semibold
                        leading-6
                        text-white

                    "

                >

                    {data.label}

                </h3>

                <div

                    className="

                        mt-4
                        flex
                        items-center
                        justify-between

                    "

                >

                    <div

                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium

                            ${status.badge}
                        `}

                    >

                        <span

                            className={`
                                h-2
                                w-2
                                rounded-full

                                ${status.dot}
                            `}

                        />

                        {displayStatus}

                    </div>

                    <span

                        className="

                            text-[11px]
                            uppercase
                            tracking-wider
                            text-zinc-500

                        "

                    >

                        SERVICE

                    </span>

                </div>

                <div

                    className="

                        mt-5
                        border-t
                        border-zinc-800
                        pt-4

                    "

                >

                    <p

                        className="

                            text-[11px]
                            uppercase
                            tracking-widest
                            text-zinc-500

                        "

                    >

                        Domain

                    </p>

                    <div

                        className="

                            mt-2
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            px-2.5
                            py-1
                            text-xs
                            font-medium

                        "

                        style={{

                            background:

                                domainStyle.background,

                            color:

                                domainStyle.color,

                            borderColor:

                                domainStyle.border

                        }}

                    >

                        <Tag

                            size={11}

                        />

                        {data.domain_name}

                    </div>

                </div>

            </div>

            <Handle

                type="source"

                position={Position.Right}

                style={{

                    width:6,

                    height:6,

                    background:"#52525b",

                    border:"none"

                }}

            />

        </div>

    );

}

export default ServiceNode;