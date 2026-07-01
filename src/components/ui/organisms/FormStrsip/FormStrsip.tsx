import { useState, useEffect } from "react";
import Select from "../../atoms/Select";
import styles from "./FormStrsip.module.css";
import FormStr from "./FormStr/FormStr";
import FormSip from "./FormSip/FormSip";
import type { CardStrData } from "../../organisms/CardStr/CardStr";
import type { CardSipData } from "../../organisms/CardSip/CardSip";
import { getGlobalUser } from "../../../../contexts/AuthContext";

interface FormStrsipProps {
    onCancel: () => void;
    onSubmit: (formData: FormData) => void;
    onTypeChange?: (type: "" | "STR" | "SIP") => void;
    initialStrData?: CardStrData | null;
    initialSipData?: CardSipData | null;
    isEdit?: boolean;
    isSubmitting?: boolean;
    serverErrors?: Record<string, string[]>;
    forceType?: "STR" | "SIP";
    isPegawai?: boolean;
}

const FormStrsip = ({
    onCancel,
    onSubmit,
    onTypeChange,
    initialStrData,
    initialSipData,
    isEdit,
    isSubmitting,
    serverErrors,
    forceType,
    isPegawai: isPegawaiProp,
}: FormStrsipProps) => {
    const [formType, setFormType] = useState<"" | "STR" | "SIP">(forceType || "STR");
    const user = getGlobalUser();
    const isPegawai = isPegawaiProp !== undefined ? isPegawaiProp : (user?.role.toLowerCase() === "pegawai");

    useEffect(() => {
        if (onTypeChange) {
            onTypeChange(formType);
        }
    }, [formType, onTypeChange]);

    const typeOptions = [
        { value: "STR", label: "STR" },
        { value: "SIP", label: "SIP" },
    ];

    return (
        <div className={styles.form}>
            {!isEdit && !forceType && (
                <Select
                    id="form-type"
                    name="formType"
                    label="Pilih STR/SIP"
                    options={typeOptions}
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as "" | "STR" | "SIP")}
                    required
                />
            )}

            {formType === "STR" && (
                <FormStr
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    initialData={initialStrData}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    serverErrors={serverErrors}
                    isPegawai={isPegawai}
                />
            )}
            {formType === "SIP" && (
                <FormSip
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    initialData={initialSipData}
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                    serverErrors={serverErrors}
                    isPegawai={isPegawai}
                />
            )}
        </div>
    );
};

export default FormStrsip;