import { useEffect, useState } from "react";
/**
 *Un gancho de React personalizado para determinar si el dispositivo actual es un dispositivo más pequeño
 * según el ancho de la pantalla.
 * @param {number} [breakpoint=768] - El punto de interrupción en píxeles en el que un dispositivo se considera "más pequeño".
 * @returns {boolean} - Un valor booleano que indica si el dispositivo actual es un dispositivo más pequeño.
 */
export const useResponsiveDisplay = (breakpoint: number = 768): boolean => {
  const [isSmallerDevice, setIsSmallerDevice] = useState<boolean>(false);
  const checkScreenSize = () => {
    setIsSmallerDevice(window.innerWidth < breakpoint);
  };
  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isSmallerDevice;
};
