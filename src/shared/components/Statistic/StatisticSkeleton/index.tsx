import TextSkeleton from "@shared/components/TextSkeleton";

interface IProps {
    title: string;
    size?: "normal" | "large";
    width?: string;
}

const StatisticSkeleton = ({ title, size = "normal", width = "100%" }: IProps) => {
    return (
        <div className="statistic">
            <p className="paragraph paragraph--sub-title">{title}</p>
            {size == "large" && <TextSkeleton width={width} size="large-paragraph" />}
            {size == "normal" && <TextSkeleton width={width} size="regular-paragraph" />}
        </div>
    );
};

export default StatisticSkeleton;
