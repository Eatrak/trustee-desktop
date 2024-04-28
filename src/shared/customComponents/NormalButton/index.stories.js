import "@styles/themes.css";
import "../../index.css";

import NormalButton from "@shared/components/NormalButton";

export default {
    title: "NormalButton",
    component: NormalButton,
};

const Template = (args) => <NormalButton {...args} />;

export const Normal = Template.bind({});
Normal.args = {
    text: "Click me!",
};
