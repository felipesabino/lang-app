import { registerBlockType } from "@quillforms/blocks";
import display from "./custom-block-voices-display";

registerBlockType("custom-block-voices", {
  supports: {
    editable: true,
  },
  attributes: {
    items: {
      type: "object[]",
      default: [],
    },
  },
  display,
});
