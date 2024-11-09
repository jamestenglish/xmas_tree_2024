import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
// import { useLayoutEffect as useLayoutEffectOrig } from "react";

// const canUseDOM = !!(
//   typeof window !== "undefined" &&
//   window.document &&
//   window.document.createElement
// );

// const useLayoutEffect = canUseDOM ? useLayoutEffectOrig : () => {};

const groups: Array<string> = [];

const MUTED_GROUPS = [
  "WebCamDisplay useEffect",
  "usePhotoboothState getNextStatus",
  "usePhotoboothState reducer",
  "Photobooth",
  "Photobooth useSpring onChange",
];

const groupOrig = console.group;
const groupEndOrig = console.groupEnd;
const logOrig = console.log;

const group = (name: string, ...rest: any[]) => {
  // logOrig("=asdfa\n=====\n=====\n=====\n=====\n=====\n");

  groups.push(name);
  groupOrig(name, ...rest);
  12;
};

const groupEnd = () => {
  groups.pop();
  groupEndOrig();
};

const log = (...args: any[]) => {
  if (groups.length > 0) {
    const lastGroup = groups[groups.length - 1];
    // logOrig("=====\n=====\n=====\n=====\n=====\n=====\n");
    // logOrig({ lastGroup, canLog: !MUTED_GROUPS.includes(lastGroup) });
    if (!MUTED_GROUPS.includes(lastGroup)) {
      logOrig(...args);
    }
  } else {
    logOrig(...args);
  }
};

console.group = group;
console.log = log;
console.groupEnd = groupEnd;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
