import { ButtonProps } from "@/types/interfaces";
import './index.scss'

export const Button = (props: ButtonProps) => {
    return (
        <div className="button-container">
            <button type={props.type} className={`button-styles ${props.additionalStyle}`} onClick={props.onClick}>
                {props.value}
            </button>
        </div>
    )
}