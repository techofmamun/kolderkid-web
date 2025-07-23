import { type FC } from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  breadcrumb?: boolean;
}

const PageContainer: FC<PageContainerProps> = (props) => {
  return (
    <div
      className={`min-h-screen w-full max-w-7xl flex flex-col text-white p-4  mx-auto ${props.className}`}
      style={props.style}
      id={props.id}
    >
      {props.children}
    </div>
  );
};

export default PageContainer;
