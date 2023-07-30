import { Button, ButtonToolbar } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../styles/common.module.css";

export interface FormButtonToolbarProps {
  submitButtonText?: string;
  cancelButtonText?: string;
  needCancel: boolean;
  onCancel?: () => void;
  submitButtonDisabled: boolean;
}

/**
 *
 * @param props `FormButtonToolbarProps`
 *
 * @returns Button toolbar for the forms
 */
export function FormButtonToolbar(props: FormButtonToolbarProps) {
  const {
    submitButtonText,
    cancelButtonText,
    needCancel,
    onCancel,
    submitButtonDisabled,
  } = props;

  return (
    <FormSuite.Group>
      <ButtonToolbar>
        <Button
          className={styles.formButton}
          size="md"
          appearance="primary"
          type="submit"
          disabled={submitButtonDisabled}
        >
          {submitButtonText}
        </Button>

        {needCancel ? (
          <Button
            className={styles.formButton}
            size="md"
            appearance="ghost"
            type="button"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
        ) : null}
      </ButtonToolbar>
    </FormSuite.Group>
  );
}

FormButtonToolbar.defaultProps = {
  submitButtonText: "Submit",
  cancelButtonText: "Cancel",
  needCancel: true,
};

export default FormButtonToolbar;
