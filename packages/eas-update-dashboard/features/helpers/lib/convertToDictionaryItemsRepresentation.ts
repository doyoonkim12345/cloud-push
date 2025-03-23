import { Dictionary } from "structured-headers";

export default function convertToDictionaryItemsRepresentation(obj: {
  [key: string]: string;
}): Dictionary {
  return new Map(
    Object.entries(obj).map(([k, v]) => {
      return [k, [v, new Map()]];
    })
  );
}
