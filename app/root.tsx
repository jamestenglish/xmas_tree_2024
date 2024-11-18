import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

const COLLAPSED_GROUPS = [
  "useDeviceMeta",
  // "usePlayVideo.playVideo",
  "usePlayVideo.playVideo.onloadedmetadata",
  "useFormData.onChangeForm",
  "useFormData.onChangeForm.setFormData",
];

const group = console.group;
const groupCollapsed = console.groupCollapsed;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.group = function () {
  // eslint-disable-next-line prefer-rest-params
  const args = Array.from(arguments);

  if (args.length > 0 && COLLAPSED_GROUPS.includes(args[0])) {
    groupCollapsed.apply(console, args);
  } else {
    group.apply(console, args);
  }
};

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
        {/* TODO JTE load only when needed */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons&amp;display=block"
          rel="stylesheet"
        />
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&amp;display=block"
        /> */}
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
