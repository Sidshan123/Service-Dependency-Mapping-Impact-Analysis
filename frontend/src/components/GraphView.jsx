function GraphView({

    nodes,

    edges,

    selectedService,

    onSelectService

}){

    return(

        <div

            className="

                rounded-2xl

                border
                border-[var(--border)]

                bg-[var(--card-bg)]

                overflow-hidden

            "

        >

            <div

                className="

                    h-20

                    px-6

                    border-b
                    border-[var(--border)]

                    flex
                    items-center
                    justify-between

                "

            >

                <div>

                    <h2
                        className="text-2xl font-semibold"
                    >

                        Service Dependency Graph

                    </h2>


                    <p
                        className="
                            text-sm
                            text-[var(--text-secondary)]
                            mt-1
                        "
                    >

                        {nodes.length}

                        {" "}

                        Services

                        •

                        {" "}

                        {edges.length}

                        {" "}

                        Dependencies

                    </p>

                </div>


                <div
                    className="flex gap-3"
                >

                    <button
                        className="btn-secondary w-10 h-10 rounded-lg"
                    >

                        ↗

                    </button>


                    <button
                        className="btn-secondary w-10 h-10 rounded-lg"
                    >

                        +

                    </button>


                    <button
                        className="btn-secondary w-10 h-10 rounded-lg"
                    >

                        −

                    </button>


                    <button
                        className="btn-secondary w-10 h-10 rounded-lg"
                    >

                        🔒

                    </button>

                </div>

            </div>


            <div

                className="

                    h-[540px]

                    bg-[var(--bg-primary)]

                    flex
                    flex-col
                    items-center
                    justify-center

                    text-[var(--text-secondary)]

                "

            >

                <p
                    className="text-lg"
                >

                    ReactFlow Integration Coming Next 🚀

                </p>


                {

                    selectedService && (

                        <div
                            className="
                                mt-8
                                px-5
                                py-3
                                rounded-2xl
                                bg-cyan-500/10
                                border
                                border-cyan-500/30
                                text-cyan-300
                            "
                        >

                            Selected:

                            {" "}

                            {

                                selectedService
                                .name

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default GraphView;