import { useEffect, useState } from 'react';

export function useIsVisible({ open = false, timeout = 250 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) return setVisible(true);
    const id = setTimeout(() => setVisible(false), timeout);
    return () => clearTimeout(id);
  }, [open, timeout]);

  return visible;
}
