import { registerBlockType } from "@quillforms/blocks";
import { MyCustomBlockDisplay as display } from "./custom-block-voices-display";

registerBlockType("custom-block-voices", {
  supports: {
    editable: true,
    required: true,
  },
  attributes: {
    items: {
      type: "object[]",
      default: [],
    },
  },
  display,
});
