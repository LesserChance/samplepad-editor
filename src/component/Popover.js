import React, { useEffect, useRef } from 'react';
import '../css/Popover.scss';

const Popover = ({ show, onHide, target, children, placement = 'bottom', style = {}, hideWithOutsideClick = true }) => {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!show || !hideWithOutsideClick) return;

    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target) &&
          target && !target.contains(event.target)) {
        onHide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onHide, target, hideWithOutsideClick]);

  if (!show || !target) return null;

  const targetRect = target.getBoundingClientRect();
  const margin = 5;

  // Position below the target, align right edge
  const position = {
    top: targetRect.bottom + margin,
    right: Math.max(margin, window.innerWidth - targetRect.right)
  }

  return (
    <div
      ref={popoverRef}
      className="custom-popover"
      style={{ ...position, ...style }}
    >
      {children}
    </div>
  );
};

export default Popover;
