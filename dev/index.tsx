import { render } from "solid-js/web";
import { VariantPropsOf, styled } from "../src/solid";
import { Component, JSX } from "solid-js";

type Props = {
  title: string;
};
const CustomComponent: Component<Props> = (props) => {
  return <div {...props}>{props.title}</div>;
};

const Card = styled("div", {
  base: "bg-white p-4 border-2 rounded-lg",
  variants: {
    color: {
      red: "border-red-500",
      false: "",
    },
  },
  defaultVariants: {
    color: "false",
  },
});

const TitleCard = styled(CustomComponent, "bg-white p-4 border-2 rounded-lg");

const Button = styled("button", {
  base: "px-5 py-2 text-white disabled:bg-gray-400 disabled:text-gray-300",
  variants: {
    color: {
      neutral: "bg-slate-500 hover:bg-slate-400",
      accent: "bg-teal-500 hover:bg-teal-400",
    },
    outlined: {
      true: "border-2",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-sm",
    },
  },
  compoundVariants: [
    {
      variants: { color: "accent", outlined: true },
      class: "border-teal-600",
    },
  ],
  defaultVariants: {
    color: "neutral",
  },
});

export const ExpectErrors = styled("div", {
  variants: {
    color: {
      neutral: "grey",
      accent: "hotpink",
    },
  },
  compoundVariants: [
    {
      //@ts-expect-error
      variants: { outlined: true },
      class: "",
    },
  ],
  defaultVariants: {
    //@ts-expect-error
    outlined: true,
  },
});

export function WithErrors() {
  return (
    <div>
      {/* @ts-expect-error */}
      <Button foo>unknown property</Button>

      {/* @ts-expect-error */}
      <Card foo>Unknown property</Card>

      {/* @ts-expect-error */}
      <Button color="foo">Invalid variant</Button>

      {/* @ts-expect-error */}
      <Card as="b" href="https://example.com">
        B tags don't have a href attribute
      </Card>
    </div>
  );
}

import { variantProps } from "../src/solid";

const buttonProps = variantProps({
  base: "rounded-md text-white",
  variants: {
    color: {
      brand: "bg-sky-500",
      accent: "bg-teal-500",
    },
    size: {
      small: "px-5 py-3 text-xs",
      large: "px-6 py-4 text-base",
    },
    rounded: {
      true: "rounded-full",
    },
  },
  defaultVariants: {
    color: "brand",
  },
});

type PropsX = JSX.IntrinsicElements["button"] &
  VariantPropsOf<typeof buttonProps>;

function ButtonX(props: PropsX) {
  return <button {...buttonProps(props)} />;
}

const App = () => {
  return (
    <div class="flex justify-center items-center pt-8 gap-4 flex-wrap">
      <h1>Tailwind Variants</h1>
      <Button onClick={console.log}>Accent</Button>
      <Button rounded>Neutral + Rounded</Button>
      <Button color="accent" outlined>
        Accent + Outlined
      </Button>
      <Button color="accent" disabled>
        Disabled
      </Button>
      <TitleCard title="Hello" />
      <Card>
        <h1>Hello</h1>
        <p>world</p>
      </Card>
      <Card as="a" href="https://example.com">
        Link
      </Card>
      <ButtonX size="small" color="accent" onClick={console.log}>
        Click Me!
      </ButtonX>
    </div>
  );
};

const elem = document.getElementById("app");
if (!elem) {
  throw new Error("No element with id 'app' found");
}

render(() => <App />, elem);
