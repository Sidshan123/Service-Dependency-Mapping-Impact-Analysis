import { FileText } from "lucide-react";

function ImpactSummary({

    selectedService,

    impactReport,

    onGenerateReport

}){

    return(

        <div
            className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card-bg)]
                p-8
                h-[720px]
            "
        >

            <h2
                className="
                    text-3xl
                    font-bold
                    mb-8
                "
            >

                Impact Summary

            </h2>


            {

                !impactReport && (

                    <div
                        className="
                            flex
                            flex-col
                            justify-center
                            h-[560px]
                        "
                    >

                        {

                            selectedService

                            ?

                            (

                                <div
                                    className="
                                        mb-8
                                        p-5
                                        rounded-2xl
                                        bg-cyan-500/10
                                        border
                                        border-cyan-500/20
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-[var(--text-secondary)]
                                            mb-2
                                        "
                                    >

                                        Selected Service

                                    </p>


                                    <h3
                                        className="
                                            text-2xl
                                            font-semibold
                                            text-cyan-300
                                        "
                                    >

                                        {

                                            selectedService
                                            .name

                                        }

                                    </h3>

                                </div>

                            )

                            :

                            (

                                <p
                                    className="
                                        text-[var(--text-secondary)]
                                        mb-8
                                        text-lg
                                        text-center
                                    "
                                >

                                    Select a service node to generate
                                    an impact report.

                                </p>

                            )

                        }


                        <button

                            onClick={onGenerateReport}

                            className="
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-3
                                py-4
                                rounded-xl
                                bg-cyan-600
                                hover:bg-cyan-500
                                transition
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-cyan-900/30
                            "
                        >

                            <FileText
                                size={18}
                            />

                            Generate Impact Report

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
                            gap-7
                        "
                    >

                        <div
                            className="
                                p-5
                                rounded-2xl
                                bg-cyan-500/10
                                border
                                border-cyan-500/20
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-[var(--text-secondary)]
                                    mb-2
                                "
                            >

                                Root Service

                            </p>


                            <h3
                                className="
                                    text-2xl
                                    font-semibold
                                    text-cyan-300
                                "
                            >

                                {

                                    impactReport
                                    .rootService
                                    ?.name

                                }

                            </h3>

                        </div>


                        <div
                            className="
                                flex
                                justify-between
                                text-lg
                            "
                        >

                            <span>

                                Affected Services

                            </span>

                            <span
                                className="
                                    font-semibold
                                "
                            >

                                {

                                    impactReport
                                    .affectedServicesCount

                                }

                            </span>

                        </div>


                        <div
                            className="
                                flex
                                justify-between
                                text-lg
                            "
                        >

                            <span>

                                Affected Domains

                            </span>

                            <span
                                className="
                                    font-semibold
                                "
                            >

                                {

                                    impactReport
                                    .affectedDomainsCount

                                }

                            </span>

                        </div>


                        <div
                            className="
                                flex
                                justify-between
                                text-lg
                            "
                        >

                            <span>

                                Service Impact

                            </span>

                            <span
                                className="
                                    text-cyan-400
                                    font-bold
                                "
                            >

                                {

                                    impactReport
                                    .serviceImpactPercentage

                                }%

                            </span>

                        </div>


                        <div
                            className="
                                flex
                                justify-between
                                text-lg
                            "
                        >

                            <span>

                                Domain Impact

                            </span>

                            <span
                                className="
                                    text-cyan-400
                                    font-bold
                                "
                            >

                                {

                                    impactReport
                                    .domainImpactPercentage

                                }%

                            </span>

                        </div>


                        <div
                            className="
                                flex
                                justify-between
                                text-lg
                            "
                        >

                            <span>

                                Severity

                            </span>

                            <span

                                className={

                                    impactReport
                                    .severityLevel ===
                                    "CRITICAL"

                                    ?

                                    "text-red-500 font-bold"

                                    :

                                    impactReport
                                    .severityLevel ===
                                    "HIGH"

                                    ?

                                    "text-orange-500 font-bold"

                                    :

                                    impactReport
                                    .severityLevel ===
                                    "MEDIUM"

                                    ?

                                    "text-yellow-500 font-bold"

                                    :

                                    "text-green-500 font-bold"

                                }

                            >

                                {

                                    impactReport
                                    .severityLevel

                                }

                            </span>

                        </div>


                        <div
                            className="mt-4"
                        >

                            <p
                                className="
                                    text-sm
                                    text-[var(--text-secondary)]
                                    mb-3
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

                                    impactReport
                                    .affectedServices
                                    ?.map(

                                        service => (

                                            <span

                                                key={service}

                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-cyan-500/20
                                                    text-cyan-300
                                                    text-sm
                                                "
                                            >

                                                {service}

                                            </span>

                                        )

                                    )

                                }

                            </div>

                        </div>


                        <div
                            className="mt-2"
                        >

                            <p
                                className="
                                    text-sm
                                    text-[var(--text-secondary)]
                                    mb-3
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

                                    impactReport
                                    .affectedDomainNames
                                    ?.map(

                                        domain => (

                                            <span

                                                key={domain}

                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-purple-500/20
                                                    text-purple-300
                                                    text-sm
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

                            onClick={onGenerateReport}

                            className="
                                mt-8
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-3
                                py-4
                                rounded-xl
                                bg-cyan-600
                                hover:bg-cyan-500
                                transition
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-cyan-900/30
                            "
                        >

                            <FileText
                                size={18}
                            />

                            Regenerate Report

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default ImpactSummary;