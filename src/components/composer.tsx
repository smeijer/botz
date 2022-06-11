import React, {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PaperPlaneIcon } from './icons/paper-plane-icon';

interface ComposerProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Composer({
  onSubmit,
  disabled,
  placeholder = 'Send a message…',
}: ComposerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setValue('');
      onSubmit(value);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const handlePressEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    handleSubmit();
    return false;
  };

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setValue(e.target.value);

  useEffect(() => {
    if (disabled || !ref.current) return;
    ref.current.focus();
  }, [disabled, ref]);

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <div className="botz-text-field">
        <pre>
          {value}
          <br />
        </pre>
        <textarea
          ref={ref}
          name="content"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handlePressEnter}
          disabled={disabled}
          readOnly={disabled}
          autoFocus
        />
      </div>

      <button className="botz-send-button" type="submit">
        {isSubmitting ? '...' : <PaperPlaneIcon />}
      </button>
    </form>
  );
}
