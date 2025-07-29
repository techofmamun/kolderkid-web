import { useLayoutEffect, useRef, type FC } from "react";
import { useLocation } from "react-router-dom";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  breadcrumb?: boolean;
}
const PageContainer: FC<PageContainerProps> = (props) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    
    if (pageRef.current) {
      console.log(`Navigated to: ${pathname}`);
      pageRef.current.scrollTop = 100; // Scroll to top on route change
    }
  }, []);
  return (
    <div
      ref={pageRef}
      className={`min-h-[90vh] w-full max-w-7xl flex flex-col text-white p-4 mx-auto ${props.className} overflow-auto ${props.className} scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-gray-200`}
      style={props.style}
      id={props.id}
    >
      {props.children}
    </div>
  );
};

export default PageContainer;
