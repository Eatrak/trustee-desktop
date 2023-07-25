import "@styles/themes.css";
import "../../index.css";

import Checkbox from "@shared/components/Checkbox";

export default {
    title: "Checkbox",
    component: Checkbox,
};

const Template = (args) => <Checkbox {...args} />;

export const Normal = Template.bind({});
