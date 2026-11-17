import React, { createContext, useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';

/** 当前打开的标签名。页头标题和标签同名时不再重复显示。 */
export const ActiveTabContext = createContext<string | null>(null);

/** 所有内页共用的结构：页头（标题 + 说明 + 操作）在上，内容区在下，统一 24px 间距。
 *  标签页已经说明了“我在哪”，所以页头不再放返回链接或面包屑。 */
export function Page({ title, badge, description, actions, children }: {
  title: string;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const activeTab = useContext(ActiveTabContext);
  const showTitle = title !== activeTab;
  const hasHeader = showTitle || badge || description || actions;
  return (
    <div className="space-y-5">
      {hasHeader && (
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {showTitle && (
              <div className="flex items-center gap-3">
                <h1 className="text-[2.125rem] leading-[1.15] font-semibold tracking-[-0.025em]">{title}</h1>
                {badge}
              </div>
            )}
            {!showTitle && badge && <div className="mb-1.5">{badge}</div>}
            {description && <p className={(showTitle ? 'mt-1 ' : '') + 'text-[0.9375rem] text-muted-foreground'}>{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>
      )}
      {children}
    </div>
  );
}

/** 演示里没有实现的页面：保留同样的页头结构，内容区给一句说明。 */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Page title={title} description="Part of the full ERP.">
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          This page is not included in the design preview.
        </CardContent>
      </Card>
    </Page>
  );
}
