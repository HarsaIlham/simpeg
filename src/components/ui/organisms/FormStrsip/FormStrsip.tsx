import React, { useState, useEffect } from "react";
import Select from "../../atoms/Select";
import styles from "./FormStrsip.module.css";
import FormStr from "./FormStr/FormStr";
import FormSip from "./FormSip/FormSip";

interface FormStrsipProps {
    onCancel: () => void;
    onSubmit?: (e: React.FormEvent) => void;
    onTypeChange?: (type: "" | "STR" | "SIP") => void; 
}

const FormStrsip = ({ onCancel, onSubmit, onTypeChange }: FormStrsipProps) => {
    const [formType, setFormType] = useState<"" | "STR" | "SIP">("");

    useEffect(() => {
        if (onTypeChange) {
            onTypeChange(formType);
        }
    }, [formType, onTypeChange]);

    const typeOptions = [
        { value: "", label: "Pilih STR/SIP" },
        { value: "STR", label: "STR" },
        { value: "SIP", label: "SIP" },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Select
                id="form-type"
                name="formType"
                label="Pilih STR/SIP*"
                options={typeOptions}
                value={formType}
                onChange={(e) => setFormType(e.target.value as "" | "STR" | "SIP")}
                required
            />

            {formType === "" && (
                <div className={styles.emptyState}>
                    Silakan pilih dokumen terlebih dahulu
                </div>
            )}

            {formType === "STR" && (
                <FormStr onCancel={onCancel} onSubmit={onSubmit} />
            )}
            {formType === "SIP" && (
                <FormSip onCancel={onCancel} onSubmit={onSubmit} />
            )}
        </div>
    );
};

export default FormStrsip;