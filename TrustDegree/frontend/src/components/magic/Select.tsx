import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  helperText?: string;
}

const Select = ({
  className,
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  disabled = false,
  onChange,
  error,
  label,
  helperText,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = React.useState<string>(
    defaultValue || ""
  );

    const currentValue = value ?? selectedValue;
    const currentOption = options.find((opt) => opt.value === currentValue);

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div
        ref={selectRef}
        className={cn("w-full", className)}
        {...props}
      >
        {label && (
          <label className="mb-2 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:ring-destructive",
              isOpen && "ring-2 ring-ring ring-offset-2"
            )}
          >
            <span
              className={cn(
                "truncate",
                !currentOption && "text-muted-foreground"
              )}
            >
              {currentOption ? currentOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-card py-1 shadow-md">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer items-center px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted",
                    option.disabled && "pointer-events-none opacity-50",
                    currentValue === option.value &&
                      "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {option.label}
                  {currentValue === option.value && (
                    <span className="ml-auto" aria-hidden="true">v</span>
                  )}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options
                </div>
              )}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-2 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  };
Select.displayName = "Select";

export { Select };
