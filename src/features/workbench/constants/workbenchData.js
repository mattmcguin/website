// Workbench seed data and defaults.

import gmXyzMarkdown from "../../../content/work/gm.xyz.md?raw";
import joinPerchMarkdown from "../../../content/work/joinperch.com.md?raw";
import perchAppMarkdown from "../../../content/work/perch.app.md?raw";
import technologiesMarkdown from "../../../content/personal/technologies.md?raw";

export const introTabPath = "Welcome";

export const staticFileContents = {
  [introTabPath]: `// Welcome tab — rendered as a custom React component.`,
  "work/gm.xyz": gmXyzMarkdown,
  "work/joinperch.com": joinPerchMarkdown,
  "work/perch.app": perchAppMarkdown,
  "personal/technologies.md": technologiesMarkdown,
};

export const tree = [
  {
    type: "file",
    name: "Welcome",
    path: introTabPath,
  },
  {
    type: "folder",
    name: "work",
    children: [
      { type: "file", name: "perch.app", path: "work/perch.app" },
      { type: "file", name: "joinperch.com", path: "work/joinperch.com" },
      { type: "file", name: "gm.xyz", path: "work/gm.xyz" },
    ],
  },
  {
    type: "folder",
    name: "personal",
    children: [
      {
        type: "file",
        name: "technologies.md",
        path: "personal/technologies.md",
      },
    ],
  },
];

export const defaultOpen = new Set();
export const defaultFile = introTabPath;
export const pinnedTabPaths = [introTabPath];
export const githubUsername =
  import.meta.env.VITE_GITHUB_USERNAME || "mattmcguin";
