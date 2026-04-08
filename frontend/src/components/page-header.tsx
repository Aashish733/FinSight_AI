import { Fragment, ReactNode } from "react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    rightAction?: ReactNode;
    renderPageHeader?: ReactNode
  }
  
const PageHeader = ({ title, subtitle, rightAction,renderPageHeader }: PageHeaderProps) => {
    return (
      <div className="w-full pb-16 pt-8 px-5 lg:px-0 border-b border-border bg-accent/5 backdrop-blur-sm">
        <div className="w-full max-w-[var(--max-width)]  mx-auto">
          {renderPageHeader 
          ? <Fragment>{renderPageHeader}</Fragment> 
          : (
            <div className="w-full flex flex-col gap-3 items-start justify-start lg:items-center lg:flex-row lg:justify-between">
              {(title || subtitle) && (
                <div className="space-y-1.5">
                  {title && <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">{title}</h2>}
                  {subtitle && <p className="text-muted-foreground text-sm font-medium">{subtitle}</p>}
                </div>
              )}
              {rightAction && rightAction}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PageHeader