import "./style.css";
import TextSkeleton from "@shared/components/TextSkeleton";

interface IProps {
    title: string;
    size?: "normal" | "large";
    width?: string;
}

const StatisticSkeleton = ({ title, size = "normal", width = "100%" }: IProps) => {
    return (
        <div className="statistic-skeleton">
            <p className="statistic-skeleton__title paragraph paragraph--sub-title">
                {title}
            </p>
            {size == "normal" && <TextSkeleton width={width} size="large-paragraph" />}
            {size == "large" && <TextSkeleton width={width} size="h6" />}
        </div>
    );
};

export default StatisticSkeleton;
