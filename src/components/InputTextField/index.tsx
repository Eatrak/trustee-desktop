import "./style.css";

interface IProps {
    title: string,
    placeholder?: string
}

const InputTextField = ({title, placeholder}: IProps) => {
    return(
        <div className="input-text-field">
            <p className="paragraph--small paragraph--bold input-text-field__title">{title}</p>
            <input className="input-text-field__input" placeholder={placeholder}/>
        </div>
    );
};

export default InputTextField;