import { useId } from "react";
import { useFieldContext } from "@/config/form-context";
import { ErrorContainer } from "@/components/form-components/ErrorContainer/ErrorContainer";
import styles from "./InputFields.module.css";

export const CheckboxField = () => {
  const id = useId();
  const field = useFieldContext<boolean>();

  return (
    <>
      <label htmlFor={id} className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          id={id}
          name={field.name}
          type="checkbox"
          checked={!!field.state.value}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          className={styles.input}
          style={{ width: "auto" }}
        />
        Iluminación
      </label>
      <ErrorContainer errors={field.state.meta.errors} />
    </>
  );
};
