import { Mark, mergeAttributes } from "@tiptap/core";

export interface AutoCorrectionAttrs {
  original: string;
  category: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    autoCorrection: {
      setAutoCorrection: (attrs: AutoCorrectionAttrs) => ReturnType;
      unsetAutoCorrection: () => ReturnType;
    };
  }
}

export const AutoCorrectionMark = Mark.create({
  name: "autoCorrection",
  inclusive: false,
  excludes: "",
  spanning: false,

  addAttributes() {
    return {
      original: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-original") ?? "",
        renderHTML: (attrs) =>
          attrs.original ? { "data-original": attrs.original } : {},
      },
      category: {
        default: "spelling",
        parseHTML: (el) => el.getAttribute("data-category") ?? "spelling",
        renderHTML: (attrs) =>
          attrs.category ? { "data-category": attrs.category } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-auto-correction]" }];
  },

  renderHTML({ mark, HTMLAttributes }) {
    const category = (mark.attrs.category as string) || "spelling";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-auto-correction": "",
        "data-original": mark.attrs.original ?? "",
        "data-category": category,
        class: `auto-correction auto-correction-${category}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setAutoCorrection:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetAutoCorrection:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
