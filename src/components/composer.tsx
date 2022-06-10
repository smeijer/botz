import React, {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ComposerProps {
  onSubmit: (message: string) => Promise<void>;
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
      await onSubmit(value);
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
    console.log('focus', disabled, ref.current);
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
        {isSubmitting ? (
          '...'
        ) : (
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="rgb(82, 37, 193)"
            width={16}
            height={16}
          >
            <path
              d="M1.388 15.77c-.977.518-1.572.061-1.329-1.019l1.033-4.585c.123-.543.659-1.034 1.216-1.1l6.195-.72c1.648-.19 1.654-.498 0-.687l-6.195-.708c-.55-.063-1.09-.54-1.212-1.085L.056 1.234C-.187.161.408-.289 1.387.231l12.85 6.829c.978.519.98 1.36 0 1.88l-12.85 6.83z"
              fillRule="evenodd"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
