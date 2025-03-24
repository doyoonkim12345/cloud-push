export default function truthy<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return !!value;
}
