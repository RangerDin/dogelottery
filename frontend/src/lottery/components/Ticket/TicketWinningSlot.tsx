import { forwardRef } from "react";

const TicketWinningSlot = forwardRef<SVGSVGElement>((e_, ref): JSX.Element => {
  return (
    <svg ref={ref} fill="none" viewBox="0 0 100 50" width="70%">
      <path
        d="m83 45.5c-5.25 0.0777-10.3-3.62-11.8-8.69h-42.4c-2 6.82-10.3 10.6-16.6 7.7-6.67-2.63-9.71-11.6-6.03-17.8 2.52-2.7-2.4-5.61-1.57-9.09-0.556-7.48 6.62-14.2 14-13 4.71 0.529 8.91 4.03 10.4 8.59h42.4c2-6.82 10.3-10.6 16.6-7.7 6.22 2.48 9.62 10.6 6.31 16.7-1.44 2.25-2.81 3.99-0.268 5.98 3.8 5.5 0.136 13.5-5.49 16.1-1.67 0.82-3.53 1.25-5.4 1.25z"
        stroke="#1e1e1e"
        stroke-width="5"
      />
    </svg>
  );
});

TicketWinningSlot.displayName = "TicketWinningSlot";

export default TicketWinningSlot;
