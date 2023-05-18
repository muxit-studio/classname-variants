import { ComponentProps, JSX, ValidComponent } from "solid-js";
import {
  Variants,
  variants,
  VariantsConfig,
  VariantOptions,
  Simplify,
} from "./index";

import { Dynamic } from "solid-js/web";

/**
 * Utility type to infer the first argument of a variantProps function.
 */
export type VariantPropsOf<T> = T extends (props: infer P) => any ? P : never;

/**
 * Type for the variantProps() argument – consists of the VariantOptions and an optional class for chaining.
 */
type VariantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = VariantOptions<C> & { class?: string };

export function variantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
>(config: Simplify<C>) {
  const variantClassName = variants<C>(config);
  return <P extends VariantProps<C>>(props: P) => {
    const result: any = {};

    // Pass-through all unrelated props
    for (let prop in props) {
      if (config.variants && !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed class prop for chaining
    result.class = [props.class, variantClassName(props)]
      .filter(Boolean)
      .join(" ");

    return result as { class: string } & Omit<P, keyof C["variants"]>;
  };
}

type VariantsOf<T, V> = T extends VariantsConfig ? V : {};

type AsProps<T extends ValidComponent = ValidComponent> = {
  as?: T;
};

type PolymorphicComponentProps<T extends ValidComponent> = AsProps<T> &
  Omit<ComponentProps<T>, "as">;

export function styled<
  T extends ValidComponent,
  C extends VariantsConfig<V>,
  V extends Variants = VariantsOf<C, C["variants"]>
>(type: T, config: string | Simplify<C>) {
  const styledProps =
    typeof config === "string"
      ? variantProps({ base: config, variants: {} })
      : variantProps(config);

  const Component: <As extends ValidComponent = T>(
    props: PolymorphicComponentProps<As> & VariantOptions<C>
  ) => JSX.Element = ({ as, ...props }: AsProps) => {
    return <Dynamic component={as ?? type} {...styledProps(props)} />;
  };

  return Component;
}
