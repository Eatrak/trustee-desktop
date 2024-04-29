import "./style.css";

interface IProps {
    text: string;
}

const Chip = ({ text }: IProps) => {
    return (
        <div className="chip rounded-lg bg-secondary">
            <p className="paragraph--small chip__text">{text}</p>
        </div>
    );
};

export default Chip;
