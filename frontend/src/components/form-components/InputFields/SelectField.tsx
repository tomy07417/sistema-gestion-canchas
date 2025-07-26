import React from "react";
import { useId } from "react";
import { useFieldContext } from "@/config/form-context";
import { ErrorContainer } from "@/components/form-components/ErrorContainer/ErrorContainer";
import styles from "./InputFields.module.css";

export const SelectField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const id = useId();
  const field = useFieldContext<string>();

  return (
    <div className={styles.fieldContainer}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className={styles.input}
      >
        {children}
      </select>
      <ErrorContainer errors={field.state.meta.errors} />
    </div>
  );
};