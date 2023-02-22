import { debounce } from "lodash";
import { useLayoutEffect, useState } from "react";
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    const debouncedUpdateSize = debounce(updateSize, 2000);
    window.addEventListener("resize", debouncedUpdateSize);
    updateSize();
    return () => window.removeEventListener("resize", debouncedUpdateSize);
  }, []);

  return size;
};
