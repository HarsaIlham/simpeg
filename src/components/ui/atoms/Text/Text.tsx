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

const Text = ({text, variant, weight, fontSize, as, color, className}: TextProps) => {
    let finalWeight = weight;
    if (!finalWeight) {
        switch (variant) {
            case "title": finalWeight = "bold"; break;
            case "subtitle": finalWeight = "medium"; break;
            case "caption": finalWeight = "normal"; break;
            default: finalWeight = "normal"; break; // body
        }
    }

  return (
    <div className={`
        ${styles.text} 
        ${styles[variant || "body"]} 
        ${styles[color || "default"]} 
        ${styles[finalWeight]}
        ${styles[as || "p"]}
        ${className}
    `.trim()} style={{color: color, fontSize: fontSize}}>
        {text}
    </div>
  )
}

export default Text