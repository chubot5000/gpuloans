import { cn } from "logic/utils";

export function Spinner({ className = "" }) {
  return (
    <svg className={cn("animate-spin", className)} fill="none" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <mask fill="#fff" id="spinner-mask-1">
        <path d="M28 14c0 7.732-6.268 14-14 14S0 21.732 0 14 6.268 0 14 0s14 6.268 14 14zM3.622 14c0 5.732 4.646 10.378 10.378 10.378S24.378 19.732 24.378 14 19.732 3.622 14 3.622 3.622 8.268 3.622 14z" />
      </mask>
      <path
        d="M28 14c0 7.732-6.268 14-14 14S0 21.732 0 14 6.268 0 14 0s14 6.268 14 14zM3.622 14c0 5.732 4.646 10.378 10.378 10.378S24.378 19.732 24.378 14 19.732 3.622 14 3.622 3.622 8.268 3.622 14z"
        mask="url(#spinner-mask-1)"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={4}
      />
      <mask fill="#fff" id="spinner-mask-2">
        <path d="M26.19 14c1 0 1.822.814 1.693 1.806A14 14 0 1112.194.117C13.186-.013 14 .811 14 1.811s-.817 1.795-1.802 1.968a10.378 10.378 0 1012.023 12.023c.173-.985.968-1.802 1.968-1.802z" />
      </mask>
      <path
        d="M26.19 14c1 0 1.822.814 1.693 1.806A14 14 0 1112.194.117C13.186-.013 14 .811 14 1.811s-.817 1.795-1.802 1.968a10.378 10.378 0 1012.023 12.023c.173-.985.968-1.802 1.968-1.802z"
        mask="url(#spinner-mask-2)"
        stroke="currentColor"
        strokeWidth={4}
      />
    </svg>
  );
}
