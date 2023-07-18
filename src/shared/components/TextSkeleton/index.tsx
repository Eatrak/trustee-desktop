import "./style.css";

interface IProps {
    className?: string;
    width: string;
    size?:
        | "small-paragraph"
        | "regular-paragraph"
        | "large-paragraph"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";
}

const TextSkeleton = ({ className, size, width }: IProps) => {
    return (
        <div className={`text-skeleton ${className || ""}`} style={{ width }}>
            {size == "small-paragraph" && (
                <p className="paragraph paragraph--small">&#8203;</p>
            )}
            {size == "regular-paragraph" && (
                <p className="paragraph paragraph--regular">&#8203;</p>
            )}
            {size == "large-paragraph" && (
                <p className="paragraph paragraph--large">&#8203;</p>
            )}
            {size == "h1" && <h1>&#8203;</h1>}
            {size == "h2" && <h2>&#8203;</h2>}
            {size == "h3" && <h3>&#8203;</h3>}
            {size == "h4" && <h4>&#8203;</h4>}
            {size == "h5" && <h5>&#8203;</h5>}
            {size == "h6" && <h6>&#8203;</h6>}
        </div>
    );
};

export default TextSkeleton;
