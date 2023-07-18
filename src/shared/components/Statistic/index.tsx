interface IProps {
    title: string;
    value: string;
    size?: "normal" | "large";
}

const Statistic = ({ title, value, size = "normal" }: IProps) => {
    return (
        <div className="statistic">
            <p className="paragraph paragraph--sub-title">{title}</p>
            {size == "large" && <h6 className="header--semi-bold">{value}</h6>}
            {size == "normal" && (
                <p className="paragraph paragraph--large paragraph--semi-bold">{value}</p>
            )}
        </div>
    );
};

export default Statistic;
