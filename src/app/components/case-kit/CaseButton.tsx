'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './case-button.module.css';

type CommonProps = {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'icon' | 'text' | 'back' | 'media' | 'overlay' | 'tab';
  arrow?: 'up-right' | 'left' | 'none';
};
type CaseButtonProps = CommonProps & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; disabled?: never })
);

/** Portfolio actions share one implementation; embedded product controls keep their own system. */
export function CaseButton({ children, variant = 'primary', arrow, className = '', ...props }: CaseButtonProps) {
  const direction = arrow ?? (variant === 'primary' || variant === 'secondary' ? 'up-right' : 'none');
  const content = <>
    {direction === 'left' && <ArrowLeft className={styles.arrow} aria-hidden="true" />}
    {children}
    {direction === 'up-right' && <ArrowUpRight className={styles.arrow} aria-hidden="true" />}
  </>;
  const classes = `${styles.button} ${styles[variant]} ${className}`;
  if (props.href !== undefined) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return props.href.startsWith('/')
      ? <Link {...linkProps} className={classes} data-case-button={variant}>{content}</Link>
      : <a {...linkProps} className={classes} data-case-button={variant}>{content}</a>;
  }
  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type="button" {...buttonProps} className={classes} data-case-button={variant}>{content}</button>;
}

/** Real links let the style page demonstrate enabled controls without dead actions. */
export function CaseButtonSamples() {
  return <div>
    <p className={styles.sampleLabel}>Buttons</p>
    <div className={styles.samples}>
      <CaseButton href="/projects/def-erp">Sample case</CaseButton>
      <CaseButton variant="secondary" href="/#work">All work</CaseButton>
      <CaseButton variant="icon" href="/projects/def-erp" aria-label="View sample case"><ArrowUpRight aria-hidden="true" /></CaseButton>
      <CaseButton disabled>Disabled</CaseButton>
    </div>
  </div>;
}
