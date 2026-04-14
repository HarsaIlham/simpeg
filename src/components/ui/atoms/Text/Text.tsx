import styles from "./Text.module.css"

type TextVariant = "title" | "subtitle" | "body" | "caption";

type TextWeight = "bold" | "semibold" | "medium" | "normal";

interface TextProps {
    text: string;
    variant?: TextVariant;
    weight?: TextWeight;
    fontSize?: string;
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
    color?: "default" | "white" | "muted" | "green" | string;
    className?: string;
}

const Text = (props: TextProps) => {
    let finalWeight = props.weight;
    if (!finalWeight) {
        switch (props.variant) {
            case "title": finalWeight = "bold"; break;
            case "subtitle": finalWeight = "medium"; break;
            case "caption": finalWeight = "normal"; break;
            default: finalWeight = "normal"; break; // body
        }
    }

  return (
    <div className={`
        ${styles.text} 
        ${styles[props.variant || "body"]} 
        ${styles[props.color || "default"]} 
        ${styles[finalWeight]}
    `.trim()} style={{color: props.color, fontSize: props.fontSize}}>
        {props.text}
    </div>
  )
}

export default Text