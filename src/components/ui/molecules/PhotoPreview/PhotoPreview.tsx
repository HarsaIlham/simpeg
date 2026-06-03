import React from "react";
import styles from "./PhotoPreview.module.css";
import Button from "../../atoms/Button";
import { Camera } from "lucide-react";

interface PhotoPreviewProps {
    imgSrc?: string | null;
    fallbackIcon?: React.ReactNode;
    onUploadClick: () => void;
    isUploading?: boolean;
}

const PhotoPreview = ({ imgSrc, fallbackIcon, onUploadClick, isUploading = false }: PhotoPreviewProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                {imgSrc ? (
                    <img src={imgSrc} alt="Preview Profil" className={styles.image} />
                ) : (
                    <div className={styles.fallback}>
                        {fallbackIcon}
                    </div>
                )}
            </div>
            
            <div className={styles.action}>
                <Button 
                    label={isUploading ? "Mengupload..." : "Ganti Foto Profil"}
                    icon={<Camera size={18} />}
                    variant="primary"
                    onClick={onUploadClick}
                    disabled={isUploading}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default PhotoPreview;
