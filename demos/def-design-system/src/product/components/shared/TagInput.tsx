import { useState, type FocusEventHandler, type KeyboardEvent } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type TagInputProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  maxTags?: number;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

function normalizeTag(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

/** 可新增、删除的自由标签输入；用于商品标签等非固定枚举。 */
export function TagInput({
  value,
  onValueChange,
  id,
  name,
  placeholder = 'Type a tag, then Enter',
  ariaLabel = 'Tags',
  disabled = false,
  className,
  maxTags,
  onBlur,
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const reachedLimit = maxTags !== undefined && value.length >= maxTags;

  function addDraft() {
    const next = normalizeTag(draft);
    if (!next || reachedLimit) return;
    if (!value.some((tag) => tag.toLocaleLowerCase() === next.toLocaleLowerCase())) {
      onValueChange([...value, next]);
    }
    setDraft('');
  }

  function removeTag(index: number) {
    onValueChange(value.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
      event.preventDefault();
      addDraft();
      return;
    }

    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      event.preventDefault();
      removeTag(value.length - 1);
    }
  }

  return (
    <div
      data-slot="tag-input"
      className={cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2 py-1 transition-colors',
        'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      {name && value.map((tag, index) => (
        <input key={`${tag}-${index}`} type="hidden" name={name} value={tag} />
      ))}

      <div role="list" aria-label="Added tags" className="contents">
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            role="listitem"
            variant="outline"
            className="h-7 max-w-full gap-1 bg-card px-2.5 pr-1.5 text-foreground"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove tag ${tag}`}
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => removeTag(index)}
            >
              <XIcon className="size-3" aria-hidden />
            </button>
          </Badge>
        ))}
      </div>

      <Input
        id={id}
        value={draft}
        disabled={disabled || reachedLimit}
        aria-label={ariaLabel}
        placeholder={value.length > 0 ? 'Add another…' : placeholder}
        className="h-7 min-w-28 flex-1 rounded-none border-0 bg-transparent px-1 py-0 shadow-none focus-visible:border-transparent focus-visible:ring-0 disabled:bg-transparent disabled:opacity-100"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled={disabled || reachedLimit || !normalizeTag(draft)}
        aria-label="Add tag"
        onMouseDown={(event) => event.preventDefault()}
        onClick={addDraft}
      >
        <PlusIcon aria-hidden />
      </Button>
    </div>
  );
}
