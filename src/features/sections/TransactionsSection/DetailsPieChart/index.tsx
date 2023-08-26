import { FC } from "react";
import type { EChartsOption } from "echarts";
import EChart from "echarts-for-react";

import "./style.css";

interface IProps {
    className?: string;
    title: string;
    data: any[];
    currencySymbol: string;
}

const DetailsPieChart: FC<IProps> = ({ className = "", title, data, currencySymbol }) => {
    const getOption = () => {
        const option: EChartsOption = {
            tooltip: {
                trigger: "item",
                formatter: (params: any) =>
                    `<p class="paragraph--bold">${params.name}</p>${currencySymbol}${params.value}`,
            },
            legend: {
                type: "scroll",
            },
            series: [
                {
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            fontWeight: "bold",
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data,
                },
            ],
        };

        return option;
    };

    return (
        <div className={`details-pie-chart ${className}`}>
            <p className="paragraph--large paragraph--semi-bold">{title}</p>
            <EChart className="details-pie-chart__chart" option={getOption()} />
        </div>
    );
};

export default DetailsPieChart;
