import isPropValid from "@emotion/is-prop-valid";

export const shouldForwardProp = (prop: PropertyKey) =>
  typeof prop === "string" && isPropValid(prop) && !prop.startsWith("$");
