"use client";

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

type ControlSize = "default" | "compact";
type ControlVariant = "default" | "embedded";

const controlSizeClass: Record<ControlSize, string> = {
  default: "rounded-lg px-3 py-2 text-sm",
  compact: "rounded-md px-2.5 py-1.5 text-sm",
};

const sharedControlClass =
  "w-full border border-input-border bg-chat-bg text-text-primary placeholder:text-text-secondary transition-colors";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  controlSize?: ControlSize;
  controlVariant?: ControlVariant;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { className = "", controlSize = "default", controlVariant = "default", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`${controlVariant === "default" ? `${sharedControlClass} ${controlSizeClass[controlSize]}` : "border-0 bg-transparent text-text-primary placeholder:text-text-secondary"} mono-field ${className}`.trim()}
      {...props}
    />
  );
});

export interface FormSearchInputProps extends Omit<FormInputProps, "type"> {
  wrapperClassName?: string;
}

/** Search input with a consistent leading icon and shared FormInput styling. */
export const FormSearchInput = forwardRef<HTMLInputElement, FormSearchInputProps>(function FormSearchInput(
  { className = "", wrapperClassName = "", ...props },
  ref
) {
  return (
    <div className={`relative min-w-0 ${wrapperClassName}`.trim()}>
      <Search
        aria-hidden="true"
        size={14}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
      />
      <FormInput
        {...props}
        ref={ref}
        type="search"
        className={`w-full pl-8 ${className}`.trim()}
      />
    </div>
  );
});

interface SelectOptionProps {
  value?: string | number;
  disabled?: boolean;
  children?: ReactNode;
}

export interface FormSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  controlSize?: ControlSize;
  controlVariant?: ControlVariant;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(function FormSelect(
  {
    className = "",
    controlSize = "default",
    controlVariant = "default",
    value,
    defaultValue,
    onChange,
    children,
    disabled,
    "aria-label": ariaLabel,
    ...buttonProps
  },
  ref
) {
  const generatedId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const selectedValue = String(isControlled ? value : uncontrolledValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);

  const options = Children.toArray(children).flatMap((child) => {
    if (!isValidElement<SelectOptionProps>(child) || child.type !== "option") return [];
    const optionValue = String(child.props.value ?? "");
    return [{ value: optionValue, label: child.props.children, disabled: Boolean(child.props.disabled) }];
  });
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const selectedOption = options[selectedIndex];
  const enabledOptions = options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled);

  const updateMenuPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportPadding = 8;
    const width = Math.min(Math.max(rect.width, 180), window.innerWidth - viewportPadding * 2);
    const left = Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - width - viewportPadding));
    const desiredHeight = Math.min(280, Math.max(40, options.length * 36 + 8));
    const below = window.innerHeight - rect.bottom - viewportPadding;
    const above = rect.top - viewportPadding;
    const showAbove = below < Math.min(desiredHeight, 180) && above > below;
    const availableHeight = showAbove ? above - 8 : below - 8;
    const maxHeight = Math.max(48, Math.min(desiredHeight, availableHeight));
    setMenuStyle({
      position: "fixed",
      left,
      width,
      maxHeight,
      ...(showAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [options.length]);

  const openMenu = (initialIndex = selectedIndex) => {
    const nextIndex = initialIndex >= 0 ? initialIndex : enabledOptions[0]?.index ?? 0;
    setActiveIndex(nextIndex);
    updateMenuPosition();
    setOpen(true);
  };

  const chooseOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (!isControlled) setUncontrolledValue(option.value);
    onChange?.({
      target: { value: option.value },
      currentTarget: { value: option.value },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => () => {
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    buttonProps.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu(selectedIndex);
        return;
      }
      const currentPosition = enabledOptions.findIndex(({ index }) => index === activeIndex);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextPosition = enabledOptions.length
        ? (currentPosition + delta + enabledOptions.length) % enabledOptions.length
        : -1;
      setActiveIndex(enabledOptions[nextPosition]?.index ?? activeIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) openMenu(selectedIndex);
      else chooseOption(activeIndex);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(enabledOptions[0]?.index ?? 0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(enabledOptions.at(-1)?.index ?? 0);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      typeaheadRef.current += event.key.toLocaleLowerCase();
      const match = options.findIndex((option) => !option.disabled && String(option.label ?? "").toLocaleLowerCase().startsWith(typeaheadRef.current));
      if (match >= 0) {
        if (open) setActiveIndex(match);
        else chooseOption(match);
      }
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = setTimeout(() => { typeaheadRef.current = ""; }, 600);
    }
  };

  const controlClass = controlVariant === "default"
    ? `inline-flex w-full items-center justify-between gap-2 ${sharedControlClass} ${controlSizeClass[controlSize]} pr-3 text-left`
    : "inline-flex items-center gap-1 border-0 bg-transparent text-text-primary text-left";

  return (
    <>
      <button
        {...buttonProps}
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        className={`${controlClass} mono-select ${className}`.trim()}
        disabled={disabled}
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${generatedId}-listbox` : undefined}
        aria-activedescendant={open ? `${generatedId}-option-${activeIndex}` : undefined}
        onClick={(event) => {
          buttonProps.onClick?.(event);
          if (!event.defaultPrevented) {
            if (open) setOpen(false);
            else openMenu();
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={`${controlVariant === "default" ? "flex-1" : ""} block min-w-0 truncate`}>
          {selectedOption?.label ?? "Select an option"}
        </span>
        <ChevronDown aria-hidden size={14} className="pointer-events-none shrink-0 text-text-secondary" />
      </button>
      {open && menuStyle && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          id={`${generatedId}-listbox`}
          role="listbox"
          aria-label={ariaLabel}
          className="z-[1000] overflow-y-auto rounded-xl border border-border-default bg-chat-bg shadow-xl p-1.5 text-text-primary"
          style={{ ...menuStyle, backgroundColor: "var(--color-chat-bg, #212121)" }}
        >
          {options.map((option, index) => {
            const selected = option.value === selectedValue;
            const active = activeIndex === index;
            return (
              <div
                key={`${option.value}-${index}`}
                id={`${generatedId}-option-${index}`}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  option.disabled ? "cursor-not-allowed opacity-50" : active ? "bg-surface-hover" : "hover:bg-surface-hover"
                }`}
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                onClick={() => chooseOption(index)}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {selected && <Check aria-hidden size={14} className="shrink-0 text-text-primary" />}
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
});

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  controlSize?: ControlSize;
  controlVariant?: ControlVariant;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(function FormTextarea(
  { className = "", controlSize = "default", controlVariant = "default", ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={`${controlVariant === "default" ? `${sharedControlClass} ${controlSizeClass[controlSize]}` : "border-0 bg-transparent text-text-primary placeholder:text-text-secondary"} mono-field ${className}`.trim()}
      {...props}
    />
  );
});

export const FormCheckbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function FormCheckbox(
  { className = "", ...props },
  ref
) {
  return (
    <>
      <input ref={ref} {...props} type="checkbox" className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border border-border-control bg-surface text-transparent transition-colors peer-checked:border-action-primary peer-checked:bg-action-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-text-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface peer-disabled:opacity-60 ${className}`.trim()}
      >
        <Check size={13} strokeWidth={2.5} />
      </span>
    </>
  );
});
