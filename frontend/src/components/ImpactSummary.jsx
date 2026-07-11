import { FileText } from "lucide-react";

function ImpactSummary({

    selectedService,
    impactReport,
    onGenerateReport

}){

    function getSeverityStyle(level){

        switch(level){

            case "CRITICAL":

                return "bg-red-500/10 text-red-400";

            case "HIGH":

                return "bg-orange-500/10 text-orange-400";

            case "MEDIUM":

                return "bg-yellow-500/10 text-yellow-400";

            default:

                return "bg-green-500/10 text-green-400";

        }

    }

    return(

        <div
            className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card-bg)]
                p-8
                h-[720px]
                overflow-y-auto
            "
        >

            <h2
                className="
                    mb-8
                    text-3xl
                    font-bold
                "
            >

                Impact Summary

            </h2>

            {

                !impactReport && (

                    <div
                        className="
                            flex
                            h-[580px]
                            flex-col
                        "
                    >

                        {

                            selectedService

                            ?

                            (

                                <>

                                    <div
                                        className="
                                            rounded-2xl
                                            border
                                            border-cyan-500/20
                                            bg-cyan-500/10
                                            p-5
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                uppercase
                                                tracking-widest
                                                text-zinc-400
                                            "
                                        >

                                            Selected Service

                                        </p>

                                        <h3
                                            className="
                                                mt-2
                                                text-2xl
                                                font-semibold
                                                text-cyan-300
                                            "
                                        >

                                            {

                                                selectedService.data.label

                                            }

                                        </h3>

                                        <div
                                            className="
                                                mt-6
                                                grid
                                                grid-cols-2
                                                gap-5
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-xs
                                                        uppercase
                                                        text-zinc-500
                                                    "
                                                >

                                                    Domain

                                                </p>

                                                <p
                                                    className="
                                                        mt-2
                                                        font-medium
                                                    "
                                                >

                                                    {

                                                        selectedService.data.domain_name

                                                    }

                                                </p>

                                            </div>

                                            <div>

                                                <p
                                                    className="
                                                        text-xs
                                                        uppercase
                                                        text-zinc-500
                                                    "
                                                >

                                                    Status

                                                </p>

                                                <span
                                                    className="
                                                        mt-2
                                                        inline-flex
                                                        rounded-full
                                                        bg-green-500/10
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        text-green-400
                                                    "
                                                >

                                                    {

                                                        selectedService.data.status

                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div
                                        className="
                                            mt-6
                                            rounded-xl
                                            border
                                            border-zinc-800
                                            bg-zinc-900
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                leading-7
                                                text-zinc-400
                                            "
                                        >

                                            Generate an impact report to identify every downstream service and domain affected by changes to this service.

                                        </p>

                                    </div>

                                </>

                            )

                            :

                            (

                                <div
                                    className="
                                        flex
                                        flex-1
                                        items-center
                                        justify-center
                                    "
                                >

                                    <p
                                        className="
                                            text-center
                                            text-lg
                                            leading-7
                                            text-zinc-400
                                        "
                                    >

                                        Select a service node from the graph to generate an impact report.

                                    </p>

                                </div>

                            )

                        }

                        <button

                        onClick={onGenerateReport}

                        disabled={!selectedService}

                        className={`
                            mt-2
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            py-4
                            font-semibold
                            transition

                            ${
                                !selectedService

                                ?

                                "bg-zinc-700 text-zinc-400 cursor-not-allowed"

                                :

                                "bg-cyan-600 text-white hover:bg-cyan-500"
                            }

                        `}

                    >


                            <FileText size={18}/>

                            Generate Report

                        </button>

                    </div>

                )

            }
                        {

                impactReport && (

                    <div
                        className="
                            flex
                            flex-col
                            gap-6
                        "
                    >

                        {/* Root Service */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-cyan-500/20
                                bg-cyan-500/10
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-zinc-400
                                "
                            >

                                Root Service

                            </p>

                            <h3
                                className="
                                    mt-2
                                    text-2xl
                                    font-semibold
                                    text-cyan-300
                                "
                            >

                                {impactReport.rootService?.name}

                            </h3>

                        </div>

                        {/* Metrics */}

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                            "
                        >

                            <MetricCard

                                title="Affected Services"

                                value={impactReport.affectedServicesCount}

                            />

                            <MetricCard

                                title="Affected Domains"

                                value={impactReport.affectedDomainsCount}

                            />

                            <MetricCard

                                title="Service Impact"

                                value={`${impactReport.serviceImpactPercentage}%`}

                                accent="text-cyan-400"

                            />

                            <MetricCard

                                title="Domain Impact"

                                value={`${impactReport.domainImpactPercentage}%`}

                                accent="text-cyan-400"

                            />

                        </div>

                        {/* Severity */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-zinc-800
                                bg-zinc-900
                                px-5
                                py-4
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    uppercase
                                    tracking-wider
                                    text-zinc-400
                                "
                            >

                                Severity

                            </span>

                            <span
                                className={`
                                    rounded-full
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    ${getSeverityStyle(
                                        impactReport.severityLevel
                                    )}
                                `}
                            >

                                {impactReport.severityLevel}

                            </span>

                        </div>

                        {/* Affected Services */}

                        <div>

                            <p
                                className="
                                    mb-3
                                    text-sm
                                    font-medium
                                    text-zinc-400
                                "
                            >

                                Affected Services

                            </p>

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {

                                    impactReport.affectedServices?.map(

                                        service=>(

                                            <span

                                                key={service}

                                                className="
                                                    rounded-full
                                                    bg-cyan-500/15
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    text-cyan-300
                                                "

                                            >

                                                {service}

                                            </span>

                                        )

                                    )

                                }

                            </div>

                        </div>

                        {/* Affected Domains */}

                        <div>

                            <p
                                className="
                                    mb-3
                                    text-sm
                                    font-medium
                                    text-zinc-400
                                "
                            >

                                Affected Domains

                            </p>

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                            >

                                {

                                    impactReport.affectedDomainNames?.map(

                                        domain=>(

                                            <span

                                                key={domain}

                                                className="
                                                    rounded-full
                                                    bg-purple-500/15
                                                    px-3
                                                    py-1
                                                    text-sm
                                                    text-purple-300
                                                "

                                            >

                                                {domain}

                                            </span>

                                        )

                                    )

                                }

                            </div>

                        </div>

                        <button

                            disabled

                            className="
                                mt-2
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-3
                                rounded-xl
                                bg-zinc-700
                                py-4
                                font-semibold
                                text-zinc-400
                                cursor-not-allowed
                            "

                        >

                            <FileText size={18}/>

                            Generate Report

                        </button>

                    </div>

                )

            }

        </div>

    );

}

function MetricCard({

    title,
    value,
    accent=""

}){

    return(

        <div
            className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-4
            "
        >

            <p
                className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-zinc-500
                "
            >

                {title}

            </p>

            <h3
                className={`
                    mt-2
                    text-3xl
                    font-bold
                    ${accent}
                `}
            >

                {value}

            </h3>

        </div>

    );

}

export default ImpactSummary;